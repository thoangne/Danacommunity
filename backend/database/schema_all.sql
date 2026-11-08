-- ====================================================================
-- CHAMPAWEB FULL DATABASE SCHEMA (TỔNG HỢP MIGRATIONS)
-- Dự án: Nền tảng Di sản & Du lịch Văn hóa Champa
-- Chạy toàn bộ file này trong Supabase SQL Editor hoặc PostgreSQL
-- ====================================================================

-- 1. PROFILES & USERS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150),
    avatar_url TEXT,
    phone_number VARCHAR(25),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'artisan', 'guide', 'admin')),
    provider VARCHAR(50) DEFAULT 'email',
    email_verified BOOLEAN DEFAULT FALSE,
    bio TEXT,
    address TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, provider)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            NEW.raw_user_meta_data->>'picture',
            ''
        ),
        COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = CASE 
            WHEN public.profiles.avatar_url IS NULL OR public.profiles.avatar_url = '' 
            THEN EXCLUDED.avatar_url 
            ELSE public.profiles.avatar_url 
        END,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 1.1 OAUTH SOCIAL ACCOUNTS
CREATE TABLE IF NOT EXISTS public.oauth_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'google' | 'facebook'
    provider_user_id VARCHAR(255) NOT NULL,
    provider_email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_oauth_accounts_provider_uid UNIQUE (provider, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_oauth_accounts_user_id ON public.oauth_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_provider_uid ON public.oauth_accounts(provider, provider_user_id);

ALTER TABLE public.oauth_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own oauth accounts" ON public.oauth_accounts FOR SELECT USING (auth.uid() = user_id);

-- 2. BLOGS & COMMENTS
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    main_category VARCHAR(30) NOT NULL CHECK (main_category IN ('tin-tuc', 'lich-su', 'van-hoa')),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(200) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    main_category VARCHAR(30) NOT NULL CHECK (main_category IN ('tin-tuc', 'lich-su', 'van-hoa')),
    category_id VARCHAR(50) REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    badge VARCHAR(50) DEFAULT 'Khảo cứu',
    badge_class VARCHAR(100) DEFAULT 'bg-amber-100 text-amber-800',
    field_location VARCHAR(150),
    read_time VARCHAR(30) DEFAULT '5 phút đọc',
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name VARCHAR(100) DEFAULT 'Ban Nghiên cứu ChampaWeb',
    author_avatar TEXT,
    summary TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON public.blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_main_category ON public.blog_articles(main_category);

DROP TRIGGER IF EXISTS trigger_blog_articles_updated_at ON public.blog_articles;
CREATE TRIGGER trigger_blog_articles_updated_at
    BEFORE UPDATE ON public.blog_articles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.blog_articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255),
    author_avatar TEXT,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'spam', 'hidden')),
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view published articles" ON public.blog_articles FOR SELECT USING (is_published = true);
CREATE POLICY "Anyone can view approved comments" ON public.blog_comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Authenticated users can post comments" ON public.blog_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR user_id IS NULL);

-- 3. ARTISANS & CRAFT PRODUCTS
CREATE TABLE IF NOT EXISTS public.artisans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    experience VARCHAR(50),
    years_of_dedication INT DEFAULT 0,
    village VARCHAR(100) NOT NULL,
    specialty VARCHAR(150),
    achievements JSONB DEFAULT '[]'::jsonb,
    workshop_location TEXT,
    quote TEXT,
    bio TEXT NOT NULL,
    schedule VARCHAR(150),
    avatar_image TEXT NOT NULL,
    hands_image TEXT,
    badge_class VARCHAR(100) DEFAULT 'bg-amber-100 text-amber-900 border-amber-300',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.craft_categories (
    id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    village VARCHAR(100),
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.craft_products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category_id VARCHAR(50) NOT NULL REFERENCES public.craft_categories(id) ON DELETE RESTRICT,
    village VARCHAR(100) NOT NULL,
    artisan_id INT REFERENCES public.artisans(id) ON DELETE SET NULL,
    price_estimate VARCHAR(50) NOT NULL,
    raw_price NUMERIC(12, 2) DEFAULT 0,
    materials TEXT[] DEFAULT ARRAY[]::TEXT[],
    dimensions VARCHAR(100),
    crafting_time VARCHAR(100),
    badge VARCHAR(100) DEFAULT 'Độc bản',
    badge_type VARCHAR(50) DEFAULT 'traditional' CHECK (badge_type IN ('exclusive', 'traditional', 'unesco', 'ocop')),
    summary TEXT,
    description TEXT,
    cultural_meaning TEXT,
    crafting_steps JSONB DEFAULT '[]'::jsonb,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_featured BOOLEAN DEFAULT false,
    preservation_status VARCHAR(100) DEFAULT 'Cần bảo tồn khẩn cấp',
    stock_quantity INT DEFAULT 1,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craft_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craft_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active artisans" ON public.artisans FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view craft categories" ON public.craft_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view craft products" ON public.craft_products FOR SELECT USING (true);

-- 4. TOURS & BOOKINGS
CREATE TABLE IF NOT EXISTS public.tours (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(150) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    badge VARCHAR(50) DEFAULT 'Khảo cứu',
    badge_class VARCHAR(100) DEFAULT 'bg-amber-100 text-amber-800',
    duration VARCHAR(50) NOT NULL,
    location VARCHAR(150) NOT NULL,
    price VARCHAR(50) NOT NULL,
    adult_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    child_price NUMERIC(12, 2) DEFAULT 0,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'craft' CHECK (category IN ('all', 'craft', 'architecture', 'ritual')),
    rating NUMERIC(2, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    chips JSONB DEFAULT '[]'::jsonb,
    gallery JSONB DEFAULT '[]'::jsonb,
    unique_touches JSONB DEFAULT '[]'::jsonb,
    timeline JSONB DEFAULT '[]'::jsonb,
    keeper_id INT REFERENCES public.artisans(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tour_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(30) NOT NULL UNIQUE,
    tour_slug VARCHAR(150) NOT NULL,
    tour_title VARCHAR(255) NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(25) NOT NULL,
    customer_email VARCHAR(255),
    pickup_note TEXT,
    departure_date DATE NOT NULL,
    adults INT NOT NULL DEFAULT 1,
    children INT DEFAULT 0,
    total_price NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status VARCHAR(30) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partially_paid', 'paid', 'refunded')),
    special_requests TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.trip_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination VARCHAR(150) NOT NULL,
    departure_date DATE,
    experience_type VARCHAR(100),
    travelers VARCHAR(50),
    customer_phone VARCHAR(25) NOT NULL,
    customer_email VARCHAR(255),
    status VARCHAR(30) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active tours" ON public.tours FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view their own tour bookings" ON public.tour_bookings FOR SELECT USING (auth.uid() = customer_id OR customer_id IS NULL);
CREATE POLICY "Anyone can create tour bookings" ON public.tour_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit trip inquiries" ON public.trip_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);

-- 5. VIEW LOGS & ANALYTICS
CREATE TABLE IF NOT EXISTS public.view_logs (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(30) NOT NULL CHECK (entity_type IN ('page', 'blog', 'product', 'tour', 'artisan')),
    entity_id VARCHAR(100) NOT NULL,
    entity_slug VARCHAR(255),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_view_logs_entity ON public.view_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_view_logs_viewed_at ON public.view_logs(viewed_at DESC);

CREATE OR REPLACE FUNCTION public.log_and_increment_view(
    p_entity_type VARCHAR,
    p_entity_id VARCHAR,
    p_entity_slug VARCHAR DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_session_id VARCHAR DEFAULT NULL,
    p_ip_address VARCHAR DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.view_logs (
        entity_type, entity_id, entity_slug, user_id, session_id,
        ip_address, user_agent, referrer, metadata, viewed_at
    ) VALUES (
        p_entity_type, p_entity_id, p_entity_slug, p_user_id, p_session_id,
        p_ip_address, p_user_agent, p_referrer, p_metadata, NOW()
    );

    IF p_entity_type = 'blog' THEN
        UPDATE public.blog_articles SET views_count = views_count + 1 WHERE slug = p_entity_id OR id::text = p_entity_id;
    ELSIF p_entity_type = 'product' THEN
        UPDATE public.craft_products SET views_count = views_count + 1 WHERE id = p_entity_id OR slug = p_entity_id;
    ELSIF p_entity_type = 'tour' THEN
        UPDATE public.tours SET views_count = views_count + 1 WHERE slug = p_entity_id OR id::text = p_entity_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE VIEW public.view_logs_daily_summary AS
SELECT 
    date_trunc('day', viewed_at)::date AS view_date,
    entity_type,
    entity_id,
    COUNT(*) AS total_views,
    COUNT(DISTINCT session_id) AS unique_visitors,
    COUNT(DISTINCT user_id) AS logged_in_users
FROM public.view_logs
GROUP BY 1, 2, 3
ORDER BY view_date DESC, total_views DESC;

ALTER TABLE public.view_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record a view log" ON public.view_logs FOR INSERT WITH CHECK (true);



-- 6. ADMIN CMS MANAGEMENT (MIGRATION 2026110706)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

ALTER TABLE public.blog_articles 
    ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
    ADD COLUMN IF NOT EXISTS seo_description TEXT,
    ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';

CREATE TABLE IF NOT EXISTS public.media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size BIGINT NOT NULL,
    dimensions VARCHAR(50),
    url TEXT NOT NULL,
    uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_files_created_at ON public.media_files(created_at DESC);

CREATE TABLE IF NOT EXISTS public.tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.article_tags (
    article_id UUID REFERENCES public.blog_articles(id) ON DELETE CASCADE,
    tag_id INT REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name VARCHAR(150) NOT NULL,
    actor_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(100),
    target_title VARCHAR(255),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_target ON public.activity_logs(target_type, target_id);

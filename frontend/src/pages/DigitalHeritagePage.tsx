import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import AudioPlayerBar from "../components/AudioPlayerBar";
import {
  DigitalHeritageHero,
  PhotoGallerySection,
  AkharBoardSection,
  ChamDictionarySection,
  InscriptionsSection,
  type DigitalHeritageTab,
} from "../components/digital-heritage";

export type { DigitalHeritageTab };

const VALID_TABS: readonly DigitalHeritageTab[] = [
  "hinh-anh",
  "ngon-ngu",
  "van-bia",
];

export default function DigitalHeritagePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab") as DigitalHeritageTab;
  const activeTab: DigitalHeritageTab = VALID_TABS.includes(rawTab)
    ? rawTab
    : "hinh-anh";

  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const toggleAudio = () => {
    setIsAudioPlaying((prev) => !prev);
  };

  const handleSelectTab = (tab: DigitalHeritageTab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="bg-surface text-on-surface font-body-md flex flex-col min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      {/* 1. Global Header */}
      <Header onToggleAudio={toggleAudio} isAudioPlaying={isAudioPlaying} />

      {/* 2. Main Content */}
      <main className="w-full pt-16 xl:pt-20 bg-surface min-h-[calc(100vh-80px)] flex flex-col">
        {/* Hero & Tab Switcher */}
        <DigitalHeritageHero
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
        />

        {/* Tab 1: Kho ảnh Văn hóa (Masonry Gallery & Lightbox) */}
        {activeTab === "hinh-anh" && <PhotoGallerySection />}

        {/* Tab 2: Số hóa Ngôn ngữ Chăm (Akhar Board & Mini Dictionary) */}
        {activeTab === "ngon-ngu" && (
          <div className="flex flex-col animate-in fade-in duration-200">
            <AkharBoardSection />
            <ChamDictionarySection />
          </div>
        )}

        {/* Tab 3: Giải mã Văn bia Cổ */}
        {activeTab === "van-bia" && <InscriptionsSection />}
      </main>

      {/* 3. Global Footer */}
      <Footer />

      {/* 4. Saranai Audio Player Floating Bar */}
      <AudioPlayerBar
        isOpen={isAudioPlaying}
        onClose={() => setIsAudioPlaying(false)}
      />

      {/* 5. Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}

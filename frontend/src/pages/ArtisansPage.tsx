import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import AudioPlayerBar from "../components/AudioPlayerBar";
import { ARTISANS } from "../data/champaData";
import type { Artisan } from "../types/heritage";
import {
  ArtisansHeroSection,
  ArtisansVillageFilter,
  ArtisansListSection,
  ArtisanWorkshopsSection,
  ArtisansCTASection,
  ArtisanBookingModal,
} from "../components/artisans";

const VILLAGE_CONFIG = [
  { id: "all", label: "Tất cả nghệ nhân" },
  { id: "Làng gốm Bàu Trúc", label: "Gốm Bàu Trúc" },
  { id: "Làng dệt Mỹ Nghiệp", label: "Dệt Mỹ Nghiệp" },
  { id: "Làng Chăm Hữu Đức", label: "Âm nhạc Hữu Đức" },
];

export default function ArtisansPage() {
  const location = useLocation();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState<string>("all");

  // State Modal đặt hẹn ghé thăm xưởng / lớp học trải nghiệm
  const [bookingArtisan, setBookingArtisan] = useState<Artisan | null>(null);
  const [experienceType, setExperienceType] = useState<string>(
    "Tham quan & Trải nghiệm thực tế"
  );

  // Cuộn mượt tới đúng vị trí nghệ nhân khi URL có hash (#artisan-1)
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace("#", "");
      const elem = document.getElementById(elementId);
      if (elem) {
        const timer = setTimeout(() => {
          elem.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location.hash]);

  // Dynamic village tabs count derived from ARTISANS data
  const villageTabs = useMemo(() => {
    return VILLAGE_CONFIG.map((cfg) => ({
      ...cfg,
      count:
        cfg.id === "all"
          ? ARTISANS.length
          : ARTISANS.filter((a) => a.village === cfg.id).length,
    }));
  }, []);

  // Filtered artisans based on active village tab
  const filteredArtisans = useMemo(() => {
    if (selectedVillage === "all") return ARTISANS;
    return ARTISANS.filter((a) => a.village === selectedVillage);
  }, [selectedVillage]);

  const handleOpenBooking = (
    artisan: Artisan,
    type = "Tham quan & Trải nghiệm thực tế"
  ) => {
    setBookingArtisan(artisan);
    setExperienceType(type);
  };

  const handleCloseBooking = () => {
    setBookingArtisan(null);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <Header
        onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)}
        isAudioPlaying={isAudioPlaying}
      />

      <main className="w-full pt-16 xl:pt-20 bg-surface flex-1">
        {/* 1. Hero: Ký ức trong đôi bàn tay */}
        <ArtisansHeroSection />

        {/* 2. Bộ lọc theo Làng nghề & Vùng di sản */}
        <ArtisansVillageFilter
          selectedVillage={selectedVillage}
          onSelectVillage={setSelectedVillage}
          tabs={villageTabs}
        />

        {/* 3. Danh sách Chân dung Nghệ nhân */}
        <ArtisansListSection
          artisans={filteredArtisans}
          onBook={(artisan) => handleOpenBooking(artisan)}
        />

        {/* 4. Lớp học nghề & Trải nghiệm thực tế tại làng */}
        <ArtisanWorkshopsSection
          artisans={ARTISANS}
          onSelectWorkshop={(artisan, type) => handleOpenBooking(artisan, type)}
        />

        {/* 5. CTA: Tour làng nghề trọn gói & Sản phẩm */}
        <ArtisansCTASection />
      </main>

      {/* Modal đặt hẹn ghé thăm xưởng / Trải nghiệm thực tế */}
      {bookingArtisan && (
        <ArtisanBookingModal
          artisan={bookingArtisan}
          initialExperienceType={experienceType}
          onClose={handleCloseBooking}
        />
      )}

      <Footer />
      <BottomNav />
      <AudioPlayerBar />
    </div>
  );
}

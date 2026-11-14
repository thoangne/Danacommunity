import { useState } from "react";
import Header from "../components/Header";
import DanaLifeCarousel from "../components/DanaLifeCarousel";
import AboutDanaSection from "../components/AboutDanaSection";
import ManifestoSection from "../components/ManifestoSection";
import ToursSection from "../components/ToursSection";
import WaypointsSection from "../components/WaypointsSection";
import ArtisansSection from "../components/ArtisansSection";
import ChampaCommunityGallery from "../components/ChampaCommunityGallery";
import BottomNav from "../components/BottomNav";
import Footer from "../components/Footer";
import AudioPlayerBar from "../components/AudioPlayerBar";

export default function DanaHome() {
  const [activeStation, setActiveStation] = useState<number>(1);

  return (
    <div className="bg-surface text-on-surface font-body-md flex flex-col min-h-screen">
      {/* 1. Header (Navbar cố định trên cùng, kết nối trực tiếp AudioContext) */}
      <Header />

      {/* 2. Main Content Stream */}
      <main className="w-full pt-16 xl:pt-20 bg-surface flex flex-col">
        {/* BANNER SLIDER FULL-WIDTH NẰM NGAY ĐẦU TRANG */}
        <DanaLifeCarousel />

        {/* Section: Giới thiệu Về Palei Dana & Không Gian Nhà Cổ Chăm */}
        <AboutDanaSection />

        {/* Section: Triết lý Di sản */}
        <ManifestoSection />

        {/* Section: Hành trình Độc bản */}
        <ToursSection />

        {/* Section: Bản đồ Tuyến Khảo Cổ & Văn Hóa */}
        <WaypointsSection
          activeStation={activeStation}
          onSelectStation={setActiveStation}
        />

        {/* Section: Nghệ nhân */}
        <ArtisansSection />

        {/* Section: Thư viện ảnh Champa Community (3 hàng chạy xen kẽ từ phải sang trái) */}
        <ChampaCommunityGallery />
      </main>

      <Footer />
      <AudioPlayerBar />
      <BottomNav />
    </div>
  );
}

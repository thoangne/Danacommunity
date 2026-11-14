import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import AudioPlayerBar from "../components/AudioPlayerBar";
import {
  LanguageHeroSection,
  AkharBoardSection,
  ChamDictionarySection,
  ChamProverbsSection,
  LanguageCommunityBanner,
} from "../components/language";

export default function LanguagePage() {
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const toggleAudio = () => {
    setIsAudioPlaying((prev) => !prev);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md flex flex-col min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      {/* 1. Global Header */}
      <Header onToggleAudio={toggleAudio} isAudioPlaying={isAudioPlaying} />

      {/* 2. Main Language Learning & Heritage Content */}
      <main className="w-full pt-16 xl:pt-20 bg-surface min-h-[calc(100vh-80px)] flex flex-col">
        {/* Hero Section */}
        <LanguageHeroSection />

        {/* Section 1: Interactive Akhar Board */}
        <AkharBoardSection />

        {/* Section 2: Mini Cham - Vietnamese Dictionary */}
        <ChamDictionarySection />

        {/* Section 3: Cham Proverbs & Life Philosophy */}
        <ChamProverbsSection />

        {/* Section 4: Community Classes Banner */}
        <LanguageCommunityBanner />
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

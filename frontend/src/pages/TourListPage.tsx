import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import AudioPlayerBar from "../components/AudioPlayerBar";
import { TOURS } from "../data/champaData";
import { BAOH_DANA_TOUR_STATIONS } from "../data/baohDanaTourGuideData";
import {
  TourHeroSection,
  TourShowcaseCard,
  TourStationsShowcase,
  TourTrustSection,
} from "../components/tour";

export default function TourListPage() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const danaTour = TOURS[0];

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <Header
        onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)}
        isAudioPlaying={isAudioPlaying}
      />

      <main className="w-full pt-16 xl:pt-20 bg-surface flex-1">
        <TourHeroSection />
        <TourShowcaseCard tour={danaTour} />
        <TourStationsShowcase
          stations={BAOH_DANA_TOUR_STATIONS}
          tourSlug={danaTour.slug}
        />
        <TourTrustSection />
      </main>

      <Footer />
      <BottomNav />
      <AudioPlayerBar />
    </div>
  );
}

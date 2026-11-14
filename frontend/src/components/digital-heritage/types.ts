import type { ComponentType } from "react";
import type { GalleryPhoto } from "../../data/galleryData";
import type { AkharLetter } from "../../data/languageData";
import type { DigitalInscription } from "../../data/digitalHeritageData";

export type DigitalHeritageTab = "hinh-anh" | "ngon-ngu" | "van-bia";

export interface DigitalHeritageTabConfig {
  id: DigitalHeritageTab;
  label: string;
  icon: ComponentType<{ className?: string }>;
  desc: string;
}

export interface DigitalHeritageHeroProps {
  activeTab: DigitalHeritageTab;
  onSelectTab: (tab: DigitalHeritageTab) => void;
}

export interface PhotoGallerySectionProps {
  initialCategory?: string;
  onPhotoClick?: (photo: GalleryPhoto) => void;
}

export interface GalleryPhotoCardProps {
  photo: GalleryPhoto;
  onClick: (photo: GalleryPhoto) => void;
}

export interface PhotoLightboxModalProps {
  photo: GalleryPhoto;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export interface AkharBoardSectionProps {
  initialLetter?: AkharLetter;
  onLetterSelect?: (letter: AkharLetter) => void;
}

export interface ChamDictionarySectionProps {
  initialCategory?: string;
}

export interface InscriptionCardProps {
  inscription: DigitalInscription;
}

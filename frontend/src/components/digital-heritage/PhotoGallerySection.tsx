import { useState, useMemo } from "react";
import {
  GALLERY_CATEGORIES,
  GALLERY_PHOTOS,
  type GalleryPhoto,
} from "../../data/galleryData";
import GalleryPhotoCard from "./GalleryPhotoCard";
import PhotoLightboxModal from "./PhotoLightboxModal";
import type { PhotoGallerySectionProps } from "./types";

export default function PhotoGallerySection({
  initialCategory = "all",
  onPhotoClick,
}: PhotoGallerySectionProps) {
  const [selectedGalleryCategory, setSelectedGalleryCategory] =
    useState<string>(initialCategory);
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const filteredPhotos = useMemo(() => {
    if (selectedGalleryCategory === "all") return GALLERY_PHOTOS;
    return GALLERY_PHOTOS.filter((p) => p.category === selectedGalleryCategory);
  }, [selectedGalleryCategory]);

  const activePhotoIndex = useMemo(() => {
    if (!activePhoto) return -1;
    return filteredPhotos.findIndex((p) => p.id === activePhoto.id);
  }, [activePhoto, filteredPhotos]);

  const handleNextPhoto = () => {
    if (activePhotoIndex === -1) return;
    const nextIndex = (activePhotoIndex + 1) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (activePhotoIndex === -1) return;
    const prevIndex =
      (activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[prevIndex]);
  };

  const handleOpenPhoto = (photo: GalleryPhoto) => {
    setActivePhoto(photo);
    onPhotoClick?.(photo);
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-200">
      <section className="w-full max-w-7xl mx-auto px-margin-mobile xl:px-margin py-space-xl">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            {GALLERY_CATEGORIES.map((cat) => {
              const isActive = selectedGalleryCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedGalleryCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer shadow-sm ${
                    isActive
                      ? "bg-primary text-on-primary ring-2 ring-primary/20 shadow-md hover:-translate-y-0.5"
                      : "bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant/30"
                  }`}
                  type="button"
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-primary-container text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="font-mono text-xs text-secondary font-semibold">
            {filteredPhotos.length} BỨC ẢNH ĐIỀN DÃ ĐỘ NÉT CAO
          </span>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPhotos.map((photo) => (
            <GalleryPhotoCard
              key={photo.id}
              photo={photo}
              onClick={handleOpenPhoto}
            />
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activePhoto && (
        <PhotoLightboxModal
          photo={activePhoto}
          currentIndex={activePhotoIndex}
          totalCount={filteredPhotos.length}
          onClose={() => setActivePhoto(null)}
          onPrev={handlePrevPhoto}
          onNext={handleNextPhoto}
        />
      )}
    </div>
  );
}

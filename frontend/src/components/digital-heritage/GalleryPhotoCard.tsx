import { Eye, MapPin, ZoomIn } from "lucide-react";
import type { GalleryPhotoCardProps } from "./types";

export default function GalleryPhotoCard({ photo, onClick }: GalleryPhotoCardProps) {
  return (
    <div
      onClick={() => onClick(photo)}
      className="group relative break-inside-avoid bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/30 transition-all duration-300 cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-auto bg-surface-container">
        <img
          src={photo.imageUrl}
          alt={photo.title}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
          <span className="font-label-sm text-xs tracking-wider uppercase text-secondary-container font-semibold">
            {photo.location}
          </span>
          <h4 className="font-serif text-lg font-bold mt-1 text-white leading-snug">
            {photo.title}
          </h4>
          <div className="flex items-center gap-2 mt-3 text-xs text-white/80">
            <Eye className="h-3.5 w-3.5" />
            <span>Bấm để xem chi tiết giám tuyển & độ nét cao</span>
          </div>
        </div>

        <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ZoomIn className="h-4 w-4" />
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-on-surface-variant font-label-sm">
          <span className="flex items-center gap-1 text-primary font-semibold">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{photo.location}</span>
          </span>
          <span className="font-mono">{photo.year}</span>
        </div>
        <h3 className="font-serif text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
          {photo.title}
        </h3>
        <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
          {photo.description}
        </p>
      </div>
    </div>
  );
}

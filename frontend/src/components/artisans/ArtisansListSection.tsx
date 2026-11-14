import type { Artisan } from "../../types/heritage";
import ArtisanCard from "./ArtisanCard";

interface ArtisansListSectionProps {
  artisans: Artisan[];
  onBook: (artisan: Artisan) => void;
}

export default function ArtisansListSection({
  artisans,
  onBook,
}: ArtisansListSectionProps) {
  if (artisans.length === 0) {
    return (
      <section className="py-space-xl">
        <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin text-center py-12">
          <p className="text-on-surface-variant text-sm">
            Không tìm thấy nghệ nhân thuộc danh mục này.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin space-y-space-xl">
        {artisans.map((artisan, index) => (
          <ArtisanCard
            key={artisan.id}
            artisan={artisan}
            index={index}
            onBook={onBook}
          />
        ))}
      </div>
    </section>
  );
}

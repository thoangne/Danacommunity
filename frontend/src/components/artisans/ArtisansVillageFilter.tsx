import type { VillageTab } from "./types";

interface ArtisansVillageFilterProps {
  selectedVillage: string;
  onSelectVillage: (villageId: string) => void;
  tabs: VillageTab[];
}

export default function ArtisansVillageFilter({
  selectedVillage,
  onSelectVillage,
  tabs,
}: ArtisansVillageFilterProps) {
  return (
    <section className="sticky top-16 xl:top-20 z-30 bg-surface/95 backdrop-blur-md border-b border-surface-container-high py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = selectedVillage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectVillage(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 flex items-center gap-2 ${
                  isActive
                    ? "bg-secondary text-white border-secondary shadow-xs"
                    : "bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:bg-surface-container hover:text-on-surface"
                }`}
                type="button"
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

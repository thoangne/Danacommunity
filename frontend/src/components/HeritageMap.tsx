import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { ExternalLink, MapPin } from "lucide-react";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Station {
  id: number;
  name: string;
  lat: number;
  lng: number;
  district: string;
  desc: string;
  googleMapsUrl?: string;
}

const STATIONS: Station[] = [
  {
    id: 1,
    name: "Đền tháp Po Klaong Garay",
    lat: 11.6033,
    lng: 108.9482,
    district: "Đô Vinh",
    desc: "Đỉnh cao kiến trúc gạch nung thế kỷ XIII trên đỉnh Đồi Trầu.",
  },
  {
    id: 2,
    name: "Đập thuỷ lợi Nha Trinh",
    lat: 11.612,
    lng: 108.931,
    district: "Sông Dinh",
    desc: "Kỳ tích trị thủy cổ do vua Po Klaong Garay khởi dựng.",
  },
  {
    id: 3,
    name: "Núi Đá Trắng - Cek Yang Patao",
    lat: 11.512,
    lng: 108.889,
    district: "Phước Hữu",
    desc: "Khối đá hoa cương trắng tự nhiên gắn với huyền tích linh thiêng.",
  },
  {
    id: 4,
    name: "Đền tháp Po Ramê",
    lat: 11.5178,
    lng: 108.9205,
    district: "Hậu Sanh",
    desc: "Ngôi tháp thế kỷ XVII thờ vị vua cuối cùng được phong thánh.",
  },
  {
    id: 5,
    name: "Làng Dệt Thổ cẩm Mỹ Nghiệp",
    lat: 11.5167,
    lng: 108.9333,
    district: "Ninh Phước",
    desc: "Làng dệt cổ xưa nhất nơi lưu giữ tinh hoa khung cửi Katê.",
  },
  {
    id: 6,
    name: "Làng Gốm Bàu Trúc (UNESCO)",
    lat: 11.5312,
    lng: 108.9567,
    district: "Phước Dân",
    desc: "Kỹ nghệ nặn gốm không bàn xoay, di sản phi vật thể nhân loại.",
  },
  {
    id: 7,
    name: "Đền thờ Po Ina Nagar Hữu Đức",
    lat: 11.505,
    lng: 108.905,
    district: "Hữu Đức",
    desc: "Nơi tôn thờ Người Mẹ Xứ Sở và lưu giữ hòm Y trang thánh.",
  },
  {
    id: 8,
    name: "Nhà cổ Chăm - Palei Baoh Dana",
    lat: 11.5844183,
    lng: 108.9116267,
    district: "Chất Thường, Phước Hậu",
    desc: "Không gian nhà cổ mẫu hệ Chăm nguyên bản, trụ sở tiếp đón cộng đồng Dana Community.",
    googleMapsUrl: "https://maps.app.goo.gl/FWVdoPUTFZDaNBZW8",
  },
];

function MapFlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 1.5 });
  }, [center, map]);
  return null;
}

interface HeritageMapProps {
  activeStation: number;
  onSelectStation: (id: number) => void;
}

export default function HeritageMap({
  activeStation,
  onSelectStation,
}: HeritageMapProps) {
  const currentStation =
    STATIONS.find((s) => s.id === activeStation) || STATIONS[0];
  const centerPosition: [number, number] = [
    currentStation.lat,
    currentStation.lng,
  ];

  return (
    <div className="relative w-full h-[450px] lg:h-[580px] rounded-xl overflow-hidden shadow-xl z-10">
      <MapContainer
        center={centerPosition}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFlyTo center={centerPosition} />

        {STATIONS.map((station) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            eventHandlers={{
              click: () => onSelectStation(station.id),
            }}
          >
            <Popup>
              <div className="p-1.5 min-w-[210px] space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] uppercase font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">
                    Trạm 0{station.id} • {station.district}
                  </span>
                  {station.id === 8 && (
                    <span className="text-[9px] uppercase font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Nhà cổ Baoh Dana
                    </span>
                  )}
                </div>
                <h5 className="font-bold text-sm text-stone-900 leading-snug">{station.name}</h5>
                <p className="text-xs text-stone-600 leading-relaxed">{station.desc}</p>
                <div className="flex items-center gap-1 text-[11px] font-mono text-stone-500 pt-1 border-t border-stone-200/80">
                  <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                  <span>{station.lat.toFixed(6)}, {station.lng.toFixed(6)}</span>
                </div>
                {station.googleMapsUrl && (
                  <a
                    href={station.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#000000" }}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 !text-black text-[11px] font-bold border border-stone-300 shadow-2xs transition-colors no-underline"
                  >
                    <span style={{ color: "#000000" }} className="!text-black font-bold">Mở Google Maps chỉ đường</span>
                    <ExternalLink className="w-3 h-3 !text-black shrink-0" style={{ color: "#000000" }} />
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

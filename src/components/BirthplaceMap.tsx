import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapPoint {
  place: string;
  count: number;
  lat: number;
  lng: number;
}

export default function BirthplaceMap({ points }: { points: MapPoint[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !points.length) return;
    const map = L.map(ref.current, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 12,
    }).addTo(map);

    const bounds: [number, number][] = [];
    for (const p of points) {
      L.circleMarker([p.lat, p.lng], {
        radius: 6 + p.count * 1.8,
        color: "#4f6bd0",
        fillColor: "#4f6bd0",
        fillOpacity: 0.5,
        weight: 2,
      })
        .addTo(map)
        .bindTooltip(`${p.place} · ${p.count}`);
      bounds.push([p.lat, p.lng]);
    }
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 9 });

    return () => map.remove();
  }, [points]);

  return <div ref={ref} className="h-80 w-full rounded-2xl border border-line" />;
}

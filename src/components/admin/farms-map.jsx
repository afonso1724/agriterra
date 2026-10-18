import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet-draw";

// Fix marker icon URLs for bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function FarmsMap({ farms = [], selectedId = null, onSelect = () => {} }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const drawnRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [-12.58, 13.41],
      zoom: 6,
      scrollWheelZoom: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    const drawn = new L.FeatureGroup();
    map.addLayer(drawn);
    drawnRef.current = drawn;
    const drawControl = new L.Control.Draw({
      edit: { featureGroup: drawn },
      draw: {
        polygon: { allowIntersection: false, showArea: true },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });
    map.addControl(drawControl);
    map.on(L.Draw.Event.CREATED, (e) => {
      drawn.addLayer(e.layer);
    });

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const farmsKey = useMemo(() => farms.map((f) => f.id).join(","), [farms]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    farms.forEach((f) => {
      const color = f.id === selectedId ? "var(--primary)" : "#2e7d3f";
      const isSel = f.id === selectedId;
      if (f.boundary?.type === "Polygon") {
        const latlngs = f.boundary.coordinates[0].map(([lng, lat]) => [lat, lng]);
        const poly = L.polygon(latlngs, {
          color,
          weight: isSel ? 3 : 2,
          fillOpacity: isSel ? 0.35 : 0.15,
        }).addTo(layer);
        poly.on("click", () => onSelect(f.id));
        poly.bindTooltip(`<b>${f.name}</b><br/>${f.crop}`, { direction: "top" });
      } else {
        L.circleMarker([f.lat, f.lng], { radius: 8, color }).addTo(layer);
      }
    });
    if (selectedId) {
      const f = farms.find((x) => x.id === selectedId);
      if (f) map.flyTo([f.lat, f.lng], 12, { duration: 0.6 });
    }
  }, [farmsKey, selectedId, farms, onSelect]);

  return (
    <div className="relative isolate z-0 [&_.leaflet-bottom]:z-[1] [&_.leaflet-container]:z-0 [&_.leaflet-pane]:z-0 [&_.leaflet-top]:z-[1]">
      <div
        ref={containerRef}
        className="h-[520px] w-full max-w-full overflow-hidden rounded-xl border border-border"
      />
    </div>
  );
}

import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Submission } from "../../types/report";
import { useMemo, useEffect } from "react";

type HealthMapProps = {
  submissions: Submission[];
  onViewReport: (id: string) => void;
};

const regionCoords: Record<string, [number, number]> = {
  "Africa": [1.6508, 17.3157],
  "Asia-Pacific": [15.8414, 100.9101],
  "Europe": [48.526, 15.2551],
  "Latin America": [-14.235, -51.9253],
  "Middle East": [29.2985, 42.551],
  "North America": [54.526, -105.2551],
  "Global / Multi-region": [20, 0],
};

// Component to handle map resizing and auto-centering
function MapController({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  
  useEffect(() => {
    // Small timeout to ensure container is fully rendered
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

export default function HealthMap({ submissions, onViewReport }: HealthMapProps) {
  const aggregatedData = useMemo(() => {
    const map = new Map<string, { count: number; totalSeverity: number; latest: Submission }>();

    submissions.forEach((s) => {
      const region = s.region;
      const existing = map.get(region) || { count: 0, totalSeverity: 0, latest: s };
      map.set(region, {
        count: existing.count + 1,
        totalSeverity: existing.totalSeverity + (s.severity || 5),
        latest: new Date(s.createdAt) > new Date(existing.latest.createdAt) ? s : existing.latest,
      });
    });

    return Array.from(map.entries()).map(([region, data]) => ({
      region,
      coords: regionCoords[region] || [0, 0],
      avgSeverity: data.totalSeverity / data.count,
      count: data.count,
      latest: data.latest,
    }));
  }, [submissions]);

  const getColor = (severity: number) => {
    if (severity >= 8) return "#ef4444"; // rose-500
    if (severity >= 5) return "#f59e0b"; // amber-500
    return "#0ea5e9"; // sky-500
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-[2.5rem] border border-white/70 bg-slate-900 shadow-[0_30px_100px_rgba(15,23,42,0.15)] backdrop-blur">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ background: "#0f172a" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapController coords={aggregatedData.map(d => d.coords)} />

        {aggregatedData.map((data) => (
          <CircleMarker
            key={data.region}
            center={data.coords}
            radius={15 + data.count * 3}
            fillColor={getColor(data.avgSeverity)}
            color={getColor(data.avgSeverity)}
            weight={1}
            fillOpacity={0.6}
            className="pulse-marker"
          >
            <Popup className="premium-popup">
              <div className="min-w-[200px] p-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {data.region}
                </p>
                <h4 className="mt-1 text-lg font-bold text-slate-950">
                  {data.count} {data.count === 1 ? "Report" : "Reports"}
                </h4>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">Avg. Severity:</span>
                  <span 
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ backgroundColor: getColor(data.avgSeverity) }}
                  >
                    {data.avgSeverity.toFixed(1)}/10
                  </span>
                </div>
                
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Latest Headline</p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-slate-800">
                    {data.latest.title}
                  </p>
                  <button
                    onClick={() => onViewReport(data.latest.id)}
                    className="mt-3 w-full rounded-xl bg-slate-950 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-slate-800"
                  >
                    View Latest Report
                  </button>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-[1000] flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-white shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Severity Scale</p>
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_10px_#ef4444]" />
          <span className="text-xs font-medium">Critical (8-10)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
          <span className="text-xs font-medium">Elevated (5-7)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-sky-500 shadow-[0_0_10px_#0ea5e9]" />
          <span className="text-xs font-medium">Monitored (1-4)</span>
        </div>
      </div>
    </div>
  );
}

import { Download, FileJson, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TacticalResultsProps {
  originalImage: string;
  maskImage: string | null;
  overlayImage: string | null;
  polygonCount: number;
  geojson: any;
}

export const TacticalResults = ({
  originalImage,
  maskImage,
  overlayImage,
  polygonCount,
  geojson,
}: TacticalResultsProps) => {
  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };

  const downloadGeoJSON = () => {
    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "water-boundaries.geojson";
    link.click();
    URL.revokeObjectURL(url);
  };

  const threatLevel = polygonCount > 10 ? "HIGH" : polygonCount > 5 ? "MEDIUM" : "LOW";
  const threatColor = polygonCount > 10 ? "text-tactical-red" : polygonCount > 5 ? "text-tactical-orange" : "text-tactical-green";

  return (
    <div className="space-y-6 animate-[fade-in_0.8s_ease-out]">
      {/* Threat Assessment Banner */}
      <div className={`tactical-panel p-6 corner-brackets ${polygonCount > 10 ? 'alert-glow' : 'tactical-glow'} hover:shadow-elevated transition-all duration-500`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {polygonCount > 10 ? (
              <AlertTriangle className="h-8 w-8 text-tactical-red animate-pulse drop-shadow-[0_0_15px_hsl(0_90%_58%)]" />
            ) : (
              <CheckCircle2 className="h-8 w-8 text-tactical-green drop-shadow-[0_0_15px_hsl(140_80%_48%)]" />
            )}
            <div>
              <h3 className="hud-text text-xl text-tactical-cyan mb-1">SCAN COMPLETE</h3>
              <p className="text-sm text-muted-foreground font-mono">
                WATER BODIES DETECTED: <span className={`font-bold text-lg ${threatColor}`}>{polygonCount}</span>
              </p>
            </div>
          </div>
          <div className="tactical-panel px-6 py-3 border border-tactical-cyan/30">
            <p className="text-[10px] hud-text text-muted-foreground mb-1">THREAT LEVEL</p>
            <p className={`hud-text text-2xl font-bold ${threatColor}`}>{threatLevel}</p>
          </div>
        </div>
      </div>

      {/* Image Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="tactical-panel p-5 corner-brackets scan-effect group hover:shadow-elevated transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="hud-text text-xs text-tactical-cyan">ORIGINAL CAPTURE</h3>
            <div className="h-2 w-2 bg-tactical-green rounded-full animate-pulse drop-shadow-[0_0_8px_hsl(140_80%_48%)]"></div>
          </div>
          <div className="relative crosshair">
            <img src={originalImage} alt="Original" className="w-full h-auto border border-tactical-cyan/30 group-hover:border-tactical-cyan/60 transition-colors" />
          </div>
        </div>

        {maskImage && (
          <div className="tactical-panel p-5 corner-brackets scan-effect group hover:shadow-elevated transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="hud-text text-xs text-tactical-orange">AI PREDICTION MASK</h3>
              <div className="h-2 w-2 bg-tactical-orange rounded-full animate-pulse drop-shadow-[0_0_8px_hsl(25_95%_58%)]"></div>
            </div>
            <div className="relative crosshair">
              <img src={maskImage} alt="Mask" className="w-full h-auto border border-tactical-orange/30 group-hover:border-tactical-orange/60 transition-colors" />
            </div>
          </div>
        )}

        {overlayImage && (
          <div className="tactical-panel p-5 corner-brackets scan-effect group hover:shadow-elevated transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="hud-text text-xs text-tactical-red">BOUNDARY OVERLAY</h3>
              <div className="h-2 w-2 bg-tactical-red rounded-full animate-pulse drop-shadow-[0_0_8px_hsl(0_90%_58%)]"></div>
            </div>
            <div className="relative crosshair">
              <img src={overlayImage} alt="Overlay" className="w-full h-auto border border-tactical-red/30 group-hover:border-tactical-red/60 transition-colors" />
            </div>
          </div>
        )}
      </div>

      {/* Data Export & Analysis */}
      {geojson && (
        <div className="tactical-panel p-8 corner-brackets hover:shadow-elevated transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="hud-text text-base text-tactical-cyan mb-2">GEOSPATIAL DATA EXPORT</h3>
              <p className="text-xs text-muted-foreground font-mono">
                COORDINATE SYSTEM: PIXEL | FORMAT: GEOJSON
              </p>
            </div>
            <div className="flex gap-3">
              {overlayImage && (
                <Button
                  onClick={() => downloadImage(overlayImage, "water-boundary-overlay.png")}
                  className="tactical-panel border border-tactical-cyan text-tactical-cyan hover:bg-tactical-cyan/10 hud-text text-xs hover:scale-105 hover:shadow-tactical transition-all"
                  size="sm"
                >
                  <Download className="mr-2 h-4 w-4" />
                  IMAGE
                </Button>
              )}
              <Button
                onClick={downloadGeoJSON}
                className="tactical-panel border border-tactical-orange text-tactical-orange hover:bg-tactical-orange/10 hud-text text-xs hover:scale-105 hover:shadow-tactical transition-all"
                size="sm"
              >
                <FileJson className="mr-2 h-4 w-4" />
                GEOJSON
              </Button>
            </div>
          </div>

          {/* GeoJSON Preview */}
          <div className="tactical-panel p-5 border border-tactical-cyan/30 hover:border-tactical-cyan/50 transition-colors">
            <h4 className="hud-text text-xs text-muted-foreground mb-3">DATA PREVIEW</h4>
            <pre className="text-[10px] font-mono overflow-auto max-h-48 text-tactical-cyan/80">
              {JSON.stringify(geojson, null, 2)}
            </pre>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            <div className="tactical-panel p-4 text-center hover:scale-105 transition-transform">
              <p className="text-[10px] hud-text text-muted-foreground mb-2">POLYGONS</p>
              <p className="text-2xl hud-text text-tactical-cyan font-bold drop-shadow-[0_0_10px_hsl(195_100%_55%/0.5)]">{polygonCount}</p>
            </div>
            <div className="tactical-panel p-4 text-center hover:scale-105 transition-transform">
              <p className="text-[10px] hud-text text-muted-foreground mb-2">COORDINATES</p>
              <p className="text-2xl hud-text text-tactical-cyan font-bold drop-shadow-[0_0_10px_hsl(195_100%_55%/0.5)]">
                {geojson.features?.reduce((sum: number, f: any) => 
                  sum + (f.geometry?.coordinates?.[0]?.length || 0), 0
                )}
              </p>
            </div>
            <div className="tactical-panel p-4 text-center hover:scale-105 transition-transform">
              <p className="text-[10px] hud-text text-muted-foreground mb-2">FORMAT</p>
              <p className="text-sm hud-text text-tactical-cyan font-bold">PIXEL</p>
            </div>
            <div className="tactical-panel p-4 text-center hover:scale-105 transition-transform">
              <p className="text-[10px] hud-text text-muted-foreground mb-2">STATUS</p>
              <p className="text-sm hud-text text-tactical-green font-bold">VALID</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { Plane } from "lucide-react";

export const TacticalLogo = () => {
  return (
    <div className="flex items-center gap-4 group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-tactical-cyan via-tactical-blue to-tactical-purple blur-2xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity"></div>
        <div className="relative tactical-panel p-4 rounded-2xl border-2 border-tactical-cyan/40 group-hover:border-tactical-cyan/70 transition-all">
          <Plane className="h-10 w-10 text-tactical-cyan drop-shadow-[0_0_10px_hsl(195_100%_55%)] group-hover:scale-110 transition-transform" />
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold hud-text tracking-wider">
          <span className="bg-gradient-to-r from-tactical-cyan to-tactical-blue bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(195_100%_55%/0.5)]">
            RESCUE
          </span>
          <span className="bg-gradient-to-r from-tactical-orange to-tactical-red bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(25_95%_58%/0.5)]">
            OP
          </span>
        </h1>
        <p className="text-xs hud-text text-muted-foreground tracking-[0.3em] mt-1">
          FLOOD DETECTION SYSTEM v2.1
        </p>
      </div>
    </div>
  );
};

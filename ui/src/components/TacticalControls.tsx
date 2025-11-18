import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Target, Zap, Settings } from "lucide-react";

interface TacticalControlsProps {
  threshold: number;
  minArea: number;
  onThresholdChange: (value: number) => void;
  onMinAreaChange: (value: number) => void;
  onProcess: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

export const TacticalControls = ({
  threshold,
  minArea,
  onThresholdChange,
  onMinAreaChange,
  onProcess,
  isProcessing,
  disabled,
}: TacticalControlsProps) => {
  return (
    <div className="tactical-panel p-6 corner-brackets space-y-6 hover:shadow-elevated transition-all duration-500">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="h-5 w-5 text-tactical-orange drop-shadow-[0_0_8px_hsl(25_95%_58%)]" />
        <h3 className="hud-text text-sm text-tactical-orange">DETECTION PARAMETERS</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="hud-text text-xs text-muted-foreground">THRESHOLD</Label>
            <span className="hud-text text-xs text-tactical-cyan font-mono bg-tactical-cyan/10 px-3 py-1 rounded-full border border-tactical-cyan/30">
              {threshold.toFixed(2)}
            </span>
          </div>
          <div className="tactical-panel p-4 border border-tactical-cyan/30 hover:border-tactical-cyan/50 transition-colors">
            <Slider
              value={[threshold]}
              onValueChange={([value]) => onThresholdChange(value)}
              min={0.1}
              max={0.9}
              step={0.05}
              disabled={disabled}
              className="cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[10px] hud-text text-muted-foreground">
            <span>0.1</span>
            <span className="text-tactical-cyan">SENSITIVITY</span>
            <span>0.9</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="hud-text text-xs text-muted-foreground">MIN POLYGON AREA</Label>
            <span className="hud-text text-xs text-tactical-cyan font-mono bg-tactical-cyan/10 px-3 py-1 rounded-full border border-tactical-cyan/30">
              {minArea}px
            </span>
          </div>
          <div className="tactical-panel p-4 border border-tactical-cyan/30 hover:border-tactical-cyan/50 transition-colors">
            <Slider
              value={[minArea]}
              onValueChange={([value]) => onMinAreaChange(value)}
              min={0}
              max={5000}
              step={100}
              disabled={disabled}
              className="cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[10px] hud-text text-muted-foreground">
            <span>0</span>
            <span className="text-tactical-cyan">FILTER SIZE</span>
            <span>5000</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border/30">
        <Button
          onClick={onProcess}
          disabled={disabled || isProcessing}
          className="w-full relative overflow-hidden bg-gradient-to-r from-tactical-cyan via-tactical-blue to-tactical-cyan hover:opacity-90 text-background font-bold py-7 transition-all disabled:opacity-50 disabled:cursor-not-allowed hud-text text-base group bg-[length:200%_100%] hover:bg-right-top duration-500"
          style={{
            boxShadow: disabled ? 'none' : '0 0 40px hsl(195 100% 55% / 0.4), inset 0 0 20px hsl(195 100% 55% / 0.2)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          {isProcessing ? (
            <>
              <Zap className="mr-2 h-5 w-5 animate-spin" />
              PROCESSING...
            </>
          ) : (
            <>
              <Target className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
              [ INITIATE SCAN ]
            </>
          )}
        </Button>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/30">
        <div className="tactical-panel p-3 text-center hover:scale-105 transition-transform">
          <p className="text-[10px] hud-text text-muted-foreground mb-1">STATUS</p>
          <p className={`text-xs hud-text font-bold ${isProcessing ? 'text-tactical-orange animate-pulse' : 'text-tactical-green'}`}>
            {isProcessing ? 'ACTIVE' : 'READY'}
          </p>
        </div>
        <div className="tactical-panel p-3 text-center hover:scale-105 transition-transform">
          <p className="text-[10px] hud-text text-muted-foreground mb-1">MODE</p>
          <p className="text-xs hud-text text-tactical-cyan font-bold">AUTO</p>
        </div>
        <div className="tactical-panel p-3 text-center hover:scale-105 transition-transform">
          <p className="text-[10px] hud-text text-muted-foreground mb-1">PRECISION</p>
          <p className="text-xs hud-text text-tactical-cyan font-bold">HIGH</p>
        </div>
      </div>
    </div>
  );
};

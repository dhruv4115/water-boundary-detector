import { Upload, X, Camera, ScanLine } from "lucide-react";
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TacticalUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage?: File | null;
  onClear?: () => void;
}

export const TacticalUpload = ({ onImageSelect, selectedImage, onClear }: TacticalUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && validateFile(file)) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const validateFile = (file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/tiff"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "INVALID FILE TYPE",
        description: "Supported formats: PNG, JPG, JPEG, TIF",
        variant: "destructive",
      });
      return false;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "FILE TOO LARGE",
        description: "Maximum file size: 20MB",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onImageSelect(file);
    }
  };

  return (
    <div className="tactical-panel p-6 corner-brackets hover:shadow-elevated transition-all duration-500">
      <div className="flex items-center gap-3 mb-4">
        <Camera className="h-5 w-5 text-tactical-cyan drop-shadow-[0_0_8px_hsl(195_100%_55%)]" />
        <h3 className="hud-text text-sm text-tactical-cyan">AERIAL IMAGE INPUT</h3>
      </div>

      {selectedImage ? (
        <div className="relative scan-effect crosshair group">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="w-full h-auto border-2 border-tactical-cyan/50 transition-all group-hover:border-tactical-cyan"
          />
          {onClear && (
            <button
              onClick={onClear}
              className="absolute top-4 right-4 p-2 tactical-panel border border-destructive hover:bg-destructive/20 transition-all hover:scale-110"
            >
              <X className="h-5 w-5 text-destructive drop-shadow-[0_0_8px_hsl(0_90%_58%)]" />
            </button>
          )}
          
          {/* HUD Overlay Elements */}
          <div className="absolute top-4 left-4 tactical-panel px-3 py-1 border border-tactical-cyan/30">
            <p className="hud-text text-[10px] text-tactical-cyan">
              {selectedImage.name}
            </p>
          </div>
          <div className="absolute bottom-4 left-4 tactical-panel px-3 py-1 border border-tactical-cyan/30">
            <p className="hud-text text-[10px] text-muted-foreground">
              {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed p-16 text-center transition-all hud-grid rounded-lg ${
            isDragging
              ? "border-tactical-cyan bg-tactical-cyan/10 tactical-glow scale-[1.02]"
              : "border-border hover:border-tactical-cyan/50"
          }`}
        >
          <div className="relative">
            <Upload className="h-20 w-20 mx-auto mb-6 text-tactical-cyan radar-pulse drop-shadow-[0_0_20px_hsl(195_100%_55%/0.5)]" />
            <ScanLine className="h-14 w-14 absolute top-0 left-1/2 -translate-x-1/2 text-tactical-orange/50 animate-pulse" />
          </div>
          
          <h3 className="hud-text text-xl mb-3 text-tactical-cyan">UPLOAD TARGET IMAGE</h3>
          <p className="text-muted-foreground text-base mb-6 font-mono">
            DRAG & DROP OR SELECT FILE
          </p>
          <p className="text-xs text-muted-foreground mb-8 font-mono opacity-70">
            FORMATS: PNG | JPG | JPEG | TIF | MAX: 20MB
          </p>
          
          <label className="inline-block px-8 py-4 tactical-panel cursor-pointer hover:tactical-glow transition-all border border-tactical-cyan text-tactical-cyan hud-text text-sm hover:scale-105 hover:shadow-elevated">
            [ SELECT FILE ]
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.tif,.tiff"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

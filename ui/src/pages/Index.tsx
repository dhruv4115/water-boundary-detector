import { useState } from "react";
import { DroneHUD } from "@/components/DroneHUD";
import { TacticalLogo } from "@/components/TacticalLogo";
import { TacticalUpload } from "@/components/TacticalUpload";
import { TacticalControls } from "@/components/TacticalControls";
import { TacticalResults } from "@/components/TacticalResults";
import { useToast } from "@/hooks/use-toast";
import { Waves, Radar, Droplets, Shield } from "lucide-react";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [threshold, setThreshold] = useState(0.5);
  const [minArea, setMinArea] = useState(200);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  // TODO: Replace with your actual Python backend URL
  const API_URL = "http://localhost:8000/api/process";

  const handleProcess = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("threshold", threshold.toString());
    formData.append("min_area", minArea.toString());

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Processing failed");
      }

      const data = await response.json();
      setResults({
        originalImage: URL.createObjectURL(selectedImage),
        maskImage: `data:image/png;base64,${data.mask_image}`,
        overlayImage: `data:image/png;base64,${data.overlay_image}`,
        polygonCount: data.polygon_count,
        geojson: data.geojson,
      });

      toast({
        title: "SCAN COMPLETE",
        description: `Detected ${data.polygon_count} water boundary zones`,
      });
    } catch (error) {
      toast({
        title: "SYSTEM ERROR",
        description: "Failed to process image. Verify backend connection.",
        variant: "destructive",
      });
      console.error("Processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-b from-tactical-blue/5 via-transparent to-tactical-cyan/5 pointer-events-none"></div>
      
      <DroneHUD />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-tactical-cyan/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-tactical-cyan/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">
            <div className="animate-[scale-in_0.6s_ease-out]">
              <TacticalLogo />
            </div>
            
            <div className="space-y-4 animate-[fade-in_0.8s_ease-out_0.2s_backwards]">
              <h2 className="text-5xl md:text-7xl font-bold hud-text bg-gradient-to-r from-tactical-cyan via-tactical-blue to-tactical-purple bg-clip-text text-transparent leading-tight">
                AI-POWERED FLOOD
                <br />
                <span className="text-tactical-orange drop-shadow-[0_0_30px_hsl(25_95%_58%/0.6)]">DETECTION SYSTEM</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
                Advanced drone reconnaissance with real-time water boundary detection
                <br />
                <span className="text-tactical-cyan">Precision mapping • Rapid deployment • Life-saving intelligence</span>
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 animate-[fade-in_1s_ease-out_0.4s_backwards]">
              {[
                { icon: Waves, label: "Water Detection", color: "text-tactical-cyan" },
                { icon: Radar, label: "AI Analysis", color: "text-tactical-blue" },
                { icon: Droplets, label: "Flood Mapping", color: "text-tactical-orange" },
                { icon: Shield, label: "Rescue Ready", color: "text-tactical-green" }
              ].map((feature, i) => (
                <div 
                  key={i}
                  className="tactical-panel px-6 py-3 flex items-center gap-3 hover:scale-105 transition-transform cursor-pointer group"
                >
                  <feature.icon className={`h-5 w-5 ${feature.color} group-hover:animate-pulse`} />
                  <span className="hud-text text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-20 relative z-10">
        {!selectedImage ? (
          <div className="max-w-4xl mx-auto animate-[fade-in_0.6s_ease-out]">
            <TacticalUpload onImageSelect={setSelectedImage} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fade-in_0.6s_ease-out]">
            <div className="lg:col-span-2 space-y-6">
              <TacticalUpload
                onImageSelect={setSelectedImage}
                selectedImage={selectedImage}
                onClear={handleClear}
              />
              
              {results && (
                <TacticalResults
                  originalImage={results.originalImage}
                  maskImage={results.maskImage}
                  overlayImage={results.overlayImage}
                  polygonCount={results.polygonCount}
                  geojson={results.geojson}
                />
              )}
            </div>

            <div className="lg:col-span-1">
              <TacticalControls
                threshold={threshold}
                minArea={minArea}
                onThresholdChange={setThreshold}
                onMinAreaChange={setMinArea}
                onProcess={handleProcess}
                isProcessing={isProcessing}
                disabled={!selectedImage || isProcessing}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

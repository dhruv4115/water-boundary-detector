import { Activity, Wifi, Battery, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export const DroneHUD = () => {
  const [time, setTime] = useState(new Date());
  const [coords, setCoords] = useState(null);


  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error(err)
    );
  }, []);



  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-start justify-between">
          {/* Top Left - Status */}
          <div className="tactical-panel px-4 py-2 corner-brackets pointer-events-auto">
            <div className="flex items-center gap-4 hud-text text-xs">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-tactical-cyan animate-pulse" />
                <span className="text-tactical-cyan">ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="h-3 w-3 text-tactical-green" />
                <span className="text-muted-foreground">SIGNAL: 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <Battery className="h-3 w-3 text-tactical-green" />
                <span className="text-muted-foreground">PWR: 98%</span>
              </div>
            </div>
          </div>

          {/* Top Right - Location & Time */}
          <div className="tactical-panel px-4 py-2 corner-brackets pointer-events-auto">
            <div className="flex items-center gap-4 hud-text text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-tactical-orange" />
                <span className="text-muted-foreground"> COORD: {coords ? `${coords.lat}, ${coords.lng}` : "Fetching..."}
                </span>

              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-tactical-cyan" />
                <span className="text-muted-foreground">
                  {time.toLocaleTimeString('en-US', { hour12: false })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

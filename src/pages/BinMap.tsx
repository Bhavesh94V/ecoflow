import { PublicNav } from "@/components/PublicNav";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Search, 
  Trash2, 
  Navigation,
  Filter,
  Locate
} from "lucide-react";
import { useState } from "react";

export default function BinMap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBin, setSelectedBin] = useState<number | null>(null);

  const bins = [
    { id: 1, name: "Green Park Main Gate", lat: 28.5355, lng: 77.3910, fill: 30, status: "normal", area: "North Zone" },
    { id: 2, name: "Market Street Corner", lat: 28.5365, lng: 77.3920, fill: 55, status: "half", area: "Central Zone" },
    { id: 3, name: "City Mall Parking", lat: 28.5375, lng: 77.3930, fill: 95, status: "overflow", area: "South Zone" },
    { id: 4, name: "Central Bus Station", lat: 28.5345, lng: 77.3900, fill: 25, status: "normal", area: "East Zone" },
    { id: 5, name: "Hospital Main Entrance", lat: 28.5335, lng: 77.3940, fill: 70, status: "half", area: "West Zone" },
    { id: 6, name: "School Campus", lat: 28.5385, lng: 77.3950, fill: 15, status: "normal", area: "North Zone" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "success";
      case "half": return "warning";
      case "overflow": return "danger";
      default: return "muted";
    }
  };

  const filteredBins = bins.filter(bin => 
    bin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bin.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNav />
      
      <div className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Smart Bin Map</h1>
            <p className="text-muted-foreground">Real-time location and status of all smart waste bins</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card className="p-6 border-2 h-[600px] relative overflow-hidden">
                <div className="absolute top-6 left-6 right-6 z-10">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Search locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background/95 backdrop-blur-sm"
                      />
                    </div>
                    <Button variant="outline" size="icon" className="bg-background/95 backdrop-blur-sm">
                      <Filter className="w-5 h-5" />
                    </Button>
                    <Button variant="hero" size="icon" className="shadow-lg">
                      <Locate className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Mock Map - In production, integrate Google Maps or similar */}
                <div className="w-full h-full bg-gradient-to-br from-muted/30 to-muted/50 rounded-lg flex items-center justify-center relative">
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-border" />
                    ))}
                  </div>

                  {/* Bin Markers */}
                  {filteredBins.map((bin) => (
                    <div
                      key={bin.id}
                      className={`absolute cursor-pointer transition-transform hover:scale-110 ${
                        selectedBin === bin.id ? "scale-125 z-20" : "z-10"
                      }`}
                      style={{
                        left: `${(bin.id * 15) % 80 + 10}%`,
                        top: `${(bin.id * 20) % 70 + 15}%`,
                      }}
                      onClick={() => setSelectedBin(bin.id)}
                    >
                      <div className={`relative`}>
                        <div className={`w-12 h-12 rounded-full bg-${getStatusColor(bin.status)} flex items-center justify-center shadow-lg border-4 border-white animate-pulse-glow`}>
                          <Trash2 className="w-6 h-6 text-white" />
                        </div>
                        {selectedBin === bin.id && (
                          <Card className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-3 min-w-[200px] shadow-xl animate-fade-in">
                            <h4 className="font-semibold text-sm mb-1">{bin.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <MapPin className="w-3 h-3" />
                              <span>{bin.area}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant={bin.status === "normal" ? "default" : bin.status === "half" ? "secondary" : "destructive"}>
                                {bin.fill}% Full
                              </Badge>
                              <Button size="sm" variant="ghost">
                                <Navigation className="w-3 h-3 mr-1" />
                                Navigate
                              </Button>
                            </div>
                          </Card>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-sm">Interactive Map View</p>
                    <p className="text-xs">Click on markers to see bin details</p>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-6 left-6 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg">
                  <h4 className="font-semibold text-sm mb-3">Status Legend</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-success" />
                      <span className="text-xs">Normal (0-40%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-warning" />
                      <span className="text-xs">Half Full (41-70%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-danger" />
                      <span className="text-xs">Overflow (71-100%)</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Bins List */}
            <div className="space-y-4">
              <Card className="p-4 border-2 bg-gradient-primary text-white">
                <h3 className="font-bold mb-2">Total Bins</h3>
                <p className="text-3xl font-bold">{bins.length}</p>
              </Card>

              <Card className="p-6 border-2 max-h-[520px] overflow-y-auto">
                <h3 className="font-bold mb-4">All Locations</h3>
                <div className="space-y-3">
                  {filteredBins.map((bin) => (
                    <div
                      key={bin.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedBin === bin.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedBin(bin.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${getStatusColor(bin.status)}/10 flex items-center justify-center flex-shrink-0`}>
                          <Trash2 className={`w-5 h-5 text-${getStatusColor(bin.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1 truncate">{bin.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <MapPin className="w-3 h-3" />
                            <span>{bin.area}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-${getStatusColor(bin.status)}`} 
                                style={{ width: `${bin.fill}%` }} 
                              />
                            </div>
                            <span className="text-xs font-medium">{bin.fill}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

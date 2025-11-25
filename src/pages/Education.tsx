import { PublicNav } from "@/components/PublicNav";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  Recycle, 
  AlertTriangle, 
  Trash2,
  Droplet,
  Wind,
  Trees,
  Heart,
  BookOpen,
  Video,
  Download,
  Share2
} from "lucide-react";

export default function Education() {
  const wasteCategories = [
    {
      title: "Biodegradable Waste",
      icon: Leaf,
      color: "success",
      description: "Organic materials that decompose naturally",
      examples: [
        "Food scraps and leftovers",
        "Fruit and vegetable peels",
        "Garden waste and leaves",
        "Paper products",
        "Natural fiber textiles"
      ],
      disposal: "Use green bins. Can be composted for fertilizer.",
    },
    {
      title: "Recyclable Waste",
      icon: Recycle,
      color: "info",
      description: "Materials that can be reprocessed into new products",
      examples: [
        "Plastic bottles and containers",
        "Glass jars and bottles",
        "Metal cans (aluminum, steel)",
        "Cardboard and paper",
        "Electronic devices (e-waste)"
      ],
      disposal: "Use blue bins. Clean and sort before recycling.",
    },
    {
      title: "Hazardous Waste",
      icon: AlertTriangle,
      color: "danger",
      description: "Materials dangerous to health or environment",
      examples: [
        "Batteries and power cells",
        "Paint and chemicals",
        "Medical waste",
        "Fluorescent bulbs",
        "Pesticides and fertilizers"
      ],
      disposal: "Special collection required. Never mix with regular waste.",
    },
    {
      title: "Non-Recyclable Waste",
      icon: Trash2,
      color: "muted",
      description: "Materials that cannot be recycled or composted",
      examples: [
        "Styrofoam packaging",
        "Disposable diapers",
        "Dirty paper products",
        "Mixed material items",
        "Contaminated packaging"
      ],
      disposal: "Use black bins. Minimize usage when possible.",
    },
  ];

  const impactStats = [
    { icon: Trees, value: "5.4M", label: "Trees Saved", color: "success" },
    { icon: Droplet, value: "850K", label: "Gallons Water Conserved", color: "info" },
    { icon: Wind, value: "2.1M", label: "kg CO₂ Reduced", color: "primary" },
    { icon: Heart, value: "94%", label: "Community Satisfaction", color: "danger" },
  ];

  const tips = [
    "Reduce single-use plastics by carrying reusable bags and bottles",
    "Compost food waste at home to create natural fertilizer",
    "Donate usable items instead of throwing them away",
    "Buy products with minimal or recyclable packaging",
    "Repair and reuse items before considering disposal",
    "Separate waste at source for efficient recycling",
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Educational Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learn About{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Sustainable Waste Management
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Understanding proper waste segregation and sustainable practices is key to building a cleaner, greener future.
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {impactStats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 text-center border-2 hover:shadow-lg transition-all hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-${stat.color}/10 flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-7 h-7 text-${stat.color}`} />
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Waste Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              Waste Segregation Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {wasteCategories.map((category, index) => (
                <Card
                  key={index}
                  className="p-8 border-2 hover:shadow-xl transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-${category.color}/10 flex items-center justify-center flex-shrink-0`}>
                      <category.icon className={`w-8 h-8 text-${category.color}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Examples:</h4>
                      <ul className="space-y-2">
                        {category.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary mt-1">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg bg-${category.color}/10 border border-${category.color}/20`}>
                      <h4 className="font-semibold mb-2 text-sm">How to Dispose:</h4>
                      <p className="text-sm text-muted-foreground">{category.disposal}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sustainable Tips */}
          <div className="mb-16">
            <Card className="p-8 md:p-12 border-2 bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">
                  Sustainable Living Tips
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-background border hover:shadow-md transition-all"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Environmental Impact */}
          <div className="mb-16">
            <Card className="p-8 md:p-12 border-2 bg-gradient-hero text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10 max-w-3xl">
                <h2 className="text-3xl font-bold mb-6">
                  Why Proper Waste Management Matters
                </h2>
                <div className="space-y-4 text-white/90 leading-relaxed">
                  <p>
                    Improper waste disposal leads to soil contamination, water pollution, and air quality degradation. 
                    Landfills emit methane, a greenhouse gas 25 times more potent than CO₂.
                  </p>
                  <p>
                    By segregating waste properly, we can:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li>• Reduce landfill burden by up to 60%</li>
                    <li>• Conserve natural resources through recycling</li>
                    <li>• Generate clean energy from organic waste</li>
                    <li>• Protect wildlife and marine ecosystems</li>
                    <li>• Create jobs in the recycling and waste management sector</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Resources Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Educational Resources</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="lg" className="gap-2">
                <Video className="w-5 h-5" />
                Watch Tutorials
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Download className="w-5 h-5" />
                Download Guide
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Share2 className="w-5 h-5" />
                Share Knowledge
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

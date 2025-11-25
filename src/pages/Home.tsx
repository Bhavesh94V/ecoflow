import { PublicNav } from "@/components/PublicNav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Trash2,
  Brain,
  Recycle,
  Route,
  Shield,
  TrendingUp,
  Users,
  Leaf,
  Bell,
  BarChart3,
  MapPin,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Trash2,
      title: "Real-time Bin Status",
      description: "Monitor bin fill levels with IoT sensors and get instant alerts when bins need collection.",
      color: "primary",
    },
    {
      icon: Brain,
      title: "AI Waste Prediction",
      description: "Machine learning algorithms predict waste generation patterns for optimized collection schedules.",
      color: "secondary",
    },
    {
      icon: Recycle,
      title: "Waste Segregation Tips",
      description: "Learn proper waste segregation with our interactive guide for biodegradable, recyclable, and hazardous waste.",
      color: "accent",
    },
    {
      icon: Route,
      title: "Route Optimization",
      description: "AI-powered route planning reduces fuel costs, emissions, and collection time by up to 40%.",
      color: "success",
    },
    {
      icon: Shield,
      title: "Blockchain Transparency",
      description: "Track waste lifecycle with immutable blockchain records for complete transparency and accountability.",
      color: "info",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get real-time alerts for collection schedules, bin status updates, and environmental rewards.",
      color: "warning",
    },
  ];

  const stats = [
    { label: "Smart Bins Monitored", value: "1,247", icon: Trash2, trend: "+12%" },
    { label: "Waste Collected Today", value: "84.3 tons", icon: TrendingUp, trend: "+8%" },
    { label: "Complaints Resolved", value: "98.5%", icon: CheckCircle2, trend: "+5%" },
    { label: "Recycling Rate", value: "67%", icon: Recycle, trend: "+15%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Waste Management</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Transform Your City with{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Smart Waste Solutions
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionize waste management with IoT sensors, AI predictions, and real-time monitoring. 
              Join the green revolution for a cleaner, sustainable future.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/citizen-register">
                <Button variant="hero" size="xl" className="gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/bin-map">
                <Button variant="outline" size="xl" className="gap-2">
                  <MapPin className="w-5 h-5" />
                  View Bin Map
                </Button>
              </Link>
            </div>

            {/* Hero Image/Illustration */}
            <div className="mt-12 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-8 p-12">
                    <div className="flex flex-col items-center gap-3 animate-float">
                      <div className="w-20 h-20 rounded-2xl bg-success/20 backdrop-blur-sm border border-success/30 flex items-center justify-center">
                        <Trash2 className="w-10 h-10 text-success" />
                      </div>
                      <span className="text-xs font-medium text-success">Normal</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 animate-float" style={{ animationDelay: "0.5s" }}>
                      <div className="w-20 h-20 rounded-2xl bg-warning/20 backdrop-blur-sm border border-warning/30 flex items-center justify-center">
                        <Trash2 className="w-10 h-10 text-warning" />
                      </div>
                      <span className="text-xs font-medium text-warning">Half Full</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 animate-float" style={{ animationDelay: "1s" }}>
                      <div className="w-20 h-20 rounded-2xl bg-danger/20 backdrop-blur-sm border border-danger/30 flex items-center justify-center">
                        <Trash2 className="w-10 h-10 text-danger" />
                      </div>
                      <span className="text-xs font-medium text-danger">Overflow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-success px-2 py-1 bg-success/10 rounded-full">
                    {stat.trend}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Smart Cities
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology meets environmental responsibility. Discover how our platform transforms waste management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8 text-white">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of citizens making their communities cleaner and greener. Start your journey towards sustainable waste management today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/citizen-register">
                <Button size="xl" className="bg-white text-primary hover:bg-white/90 shadow-lg gap-2">
                  <Users className="w-5 h-5" />
                  Register as Citizen
                </Button>
              </Link>
              <Link to="/education">
                <Button variant="outline" size="xl" className="border-white text-white hover:bg-white/10 gap-2">
                  <Leaf className="w-5 h-5" />
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

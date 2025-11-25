import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard,
  Trash2,
  Route,
  Users,
  MessageSquare,
  Radio,
  Settings,
  LogOut,
  Leaf,
  ChevronLeft
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export const AdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/bins", icon: Trash2, label: "Smart Bins" },
    { path: "/admin/routes", icon: Route, label: "Route Optimization" },
    { path: "/admin/collectors", icon: Users, label: "Collectors" },
    { path: "/admin/complaints", icon: MessageSquare, label: "Complaints" },
    { path: "/admin/iot-data", icon: Radio, label: "IoT Data" },
  ];

  return (
    <aside className={`${collapsed ? "w-20" : "w-64"} bg-sidebar border-r border-sidebar-border h-screen sticky top-0 transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">
              EcoSmart
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 text-sidebar-foreground transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive(item.path)
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link
          to="/admin/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isActive("/admin/settings")
              ? "bg-sidebar-accent text-sidebar-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Settings</span>}
        </Link>
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </Link>
      </div>
    </aside>
  );
};

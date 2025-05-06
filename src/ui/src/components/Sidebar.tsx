import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  DatabaseZap,
  BrainCircuit,
  GitCompareArrows,
  DatabaseBackup,
  Sparkles,
  Puzzle,
  Cable,
  TerminalSquare,
  BookOpen,
  AreaChart,
  Download,
  MessageSquare,
  Settings,
  ServerCog // Placeholder for MCP Server
} from "lucide-react"; // Import necessary icons

// Define navigation items
const navItems = [
  { name: "Dashboard", href: "/Dashboard", icon: LayoutDashboard },
  { name: "Data Connectors", href: "/DataConnectors", icon: DatabaseZap },
  { name: "Model Management", href: "/ModelManagement", icon: BrainCircuit },
  { name: "Model Comparison", href: "/ModelComparison", icon: GitCompareArrows },
  { name: "Model Sync", href: "/ModelSync", icon: DatabaseBackup },
  { name: "Data Cleaning", href: "/DataCleaning", icon: Sparkles },
  { name: "Automations", href: "/Automations", icon: Puzzle },
  { name: "Integrations", href: "/Integrations", icon: Cable },
  { name: "Terminal", href: "/Terminal", icon: TerminalSquare },
  { name: "API Docs", href: "/ApiDocs", icon: BookOpen },
  { name: "Monitoring", href: "/Monitoring", icon: AreaChart },
  { name: "MCP Server", href: "/McpServer", icon: ServerCog }, // Added MCP Server
  { name: "AI Chat", href: "/AiChat", icon: MessageSquare },
  { name: "Export Project", href: "/ExportProject", icon: Download },
  // Separator or different section for Settings
  { name: "Settings & Profile", href: "/Settings", icon: Settings },
  // Add Team Management link later if needed
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-e border-border/40 bg-background">
      <div className="flex h-14 items-center border-b border-border/40 px-6">
        {/* Placeholder for Logo/App Name */}
        <span className="font-semibold">SyncSage</span>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive && "bg-muted text-primary"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
      {/* Optional Footer in Sidebar */}
      {/* <div className="mt-auto p-4 border-t border-border/40">
        <Button size="sm" variant="outline" className="w-full">
          Logout
        </Button>
      </div> */}
    </aside>
  );
}

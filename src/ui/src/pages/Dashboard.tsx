import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Database,
  BrainCircuit,
  RefreshCw,
  ShieldCheck,
  PlusCircle,
  Upload,
  PlayCircle,
} from "lucide-react";

// Placeholder data
const dashboardData = {
  connectedDatabases: 3,
  managedModels: 8,
  syncStatus: "Up to date",
  systemHealth: "Healthy",
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Databases
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.connectedDatabases}
            </div>
            {/* <p className="text-xs text-muted-foreground">+2 from last month</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managed Models</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.managedModels}</div>
            {/* <p className="text-xs text-muted-foreground">+1 since last sync</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{dashboardData.syncStatus}</div>
            {/* <p className="text-xs text-muted-foreground">Last sync: 5 minutes ago</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{dashboardData.systemHealth}</div>
            {/* <p className="text-xs text-muted-foreground">No issues detected</p> */}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start">
        <h2 className="text-lg font-semibold sm:hidden">Quick Actions</h2>
        {/* Hidden on sm screens and up, visible below */}
        <div className="flex gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/DataConnectors")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Connector
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/ModelManagement")}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Model
          </Button>
          <Button variant="outline" onClick={() => navigate("/ModelSync")}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Trigger Sync
          </Button>
        </div>
      </div>
    </div>
  );
}

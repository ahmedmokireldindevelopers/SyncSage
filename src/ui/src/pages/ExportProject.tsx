import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { API_URL } from "app"; // Import the base API URL

export default function ExportProject() {

  const handleExport = () => {
    // Construct the full URL to the backend endpoint
    const exportUrl = `${API_URL}/export-project-zip`;
    // Trigger the download by navigating the browser to the endpoint URL
    window.location.href = exportUrl;
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Export Project</h1>
      <p className="text-muted-foreground">
        Click the button below to download a ZIP archive containing the current
        source code of your SyncSage project. This includes frontend and backend
        files but excludes dependencies and build artifacts.
      </p>
      <div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Download Project ZIP
        </Button>
      </div>
    </div>
  );
}

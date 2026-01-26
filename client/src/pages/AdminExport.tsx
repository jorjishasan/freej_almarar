import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Download, Database, FileJson, Package } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function AdminExport() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);
  
  const { data: stats, isLoading: statsLoading } = trpc.export.getExportStats.useQuery();
  const exportDatabase = trpc.export.exportDatabase.useQuery(undefined, { enabled: false });

  if (loading) {
    return <DashboardLayout><div className="p-8">Loading...</div></DashboardLayout>;
  }

  if (!user || user.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You need admin privileges to access this page.</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleExportDatabase = async () => {
    setIsExporting(true);
    try {
      const result = await exportDatabase.refetch();
      
      if (result.data) {
        // Create JSON blob and download
        const jsonString = JSON.stringify(result.data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `freej-almarar-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success("Database exported successfully");
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export database");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Export & Backup</h1>
          <p className="text-muted-foreground">
            Export your content and database for backup or migration purposes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Statistics Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <p className="text-muted-foreground">Loading statistics...</p>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Items:</span>
                    <span className="font-semibold">{stats?.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Archive Items:</span>
                    <span className="font-semibold">{stats?.archiveItems || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Photos:</span>
                    <span className="font-semibold">{stats?.photos || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Poems:</span>
                    <span className="font-semibold">{stats?.poems || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Books:</span>
                    <span className="font-semibold">{stats?.books || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Heritage Entries:</span>
                    <span className="font-semibold">{stats?.heritageEntries || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Events:</span>
                    <span className="font-semibold">{stats?.events || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">People:</span>
                    <span className="font-semibold">{stats?.people || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reposts:</span>
                    <span className="font-semibold">{stats?.reposts || 0}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Export Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What's Included:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ All content in both languages</li>
                    <li>✓ Navigation structure</li>
                    <li>✓ Metadata and relationships</li>
                    <li>✓ Workflow status information</li>
                    <li>✓ Featured content flags</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Format:</h4>
                  <p className="text-sm text-muted-foreground">
                    JSON format compatible with database import tools
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Full Database Export</CardTitle>
              <CardDescription>
                Export all content, navigation, and metadata in JSON format. This includes all content types
                in both Arabic and English languages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleExportDatabase} 
                disabled={isExporting}
                size="lg"
                className="w-full md:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Export Full Database"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media Files Backup</CardTitle>
              <CardDescription>
                All media files (images, documents, PDFs) are stored in S3 cloud storage. Media URLs are 
                included in the database export above. For complete backup, save both the database export 
                and download media files from the URLs in the export.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Media Storage Information:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All media files are stored in cloud storage (S3)</li>
                  <li>• Media URLs are permanent and included in exports</li>
                  <li>• Files remain accessible even after export</li>
                  <li>• For migration: use the URLs in the export to download files</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Migration Guide</CardTitle>
              <CardDescription>
                Instructions for migrating your content to another platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Step 1: Export Database</h4>
                  <p className="text-muted-foreground">
                    Click "Export Full Database" to download all content as JSON
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Step 2: Download Media Files</h4>
                  <p className="text-muted-foreground">
                    Parse the JSON export and download all media files from the URLs provided
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Step 3: Import to New Platform</h4>
                  <p className="text-muted-foreground">
                    Use the JSON structure to import content into your new platform's database
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Step 4: Upload Media</h4>
                  <p className="text-muted-foreground">
                    Upload downloaded media files to your new platform's storage and update URLs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

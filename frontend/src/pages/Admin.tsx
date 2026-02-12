import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { 
  Archive, 
  Image, 
  BookOpen, 
  Book, 
  Landmark, 
  Calendar, 
  Users, 
  Share2,
  Menu as MenuIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { getLocalizedContent } from "@shared/language";
import { toast } from "sonner";

import { AddPoemDialog } from "@/components/admin/AddPoemDialog";

export default function Admin() {
  const { user, loading } = useAuth();
  const { language, t } = useLanguage();
  const [, setLocation] = useLocation();

  if (loading) {
    return <DashboardLayout><div className="p-8">{t("loading")}</div></DashboardLayout>;
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

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("dashboard")}</h1>
          <p className="text-muted-foreground">{t("contentManagement")}</p>
        </div>

        <Tabs defaultValue="archives" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
            <TabsTrigger value="archives">
              <Archive className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("archives")}</span>
            </TabsTrigger>
            <TabsTrigger value="photos">
              <Image className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("photos")}</span>
            </TabsTrigger>
            <TabsTrigger value="poems">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("poems")}</span>
            </TabsTrigger>
            <TabsTrigger value="books">
              <Book className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("books")}</span>
            </TabsTrigger>
            <TabsTrigger value="heritage">
              <Landmark className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("heritage")}</span>
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("events")}</span>
            </TabsTrigger>
            <TabsTrigger value="people">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("people")}</span>
            </TabsTrigger>
            <TabsTrigger value="reposts">
              <Share2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("reposts")}</span>
            </TabsTrigger>
            <TabsTrigger value="navigation">
              <MenuIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Navigation</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setLocation("/admin/export")}>
              Export & Backup
            </Button>
          </div>

          <TabsContent value="archives">
            <ArchivesManagement language={language} t={t} />
          </TabsContent>
          
          <TabsContent value="photos">
            <PhotosManagement language={language} t={t} />
          </TabsContent>
          
          <TabsContent value="poems">
            <PoemsManagement language={language} t={t} />
          </TabsContent>
          
          <TabsContent value="books">
            <BooksManagement language={language} t={t} />
          </TabsContent>
          
          <TabsContent value="heritage">
            <HeritageManagement language={language} t={t} />
          </TabsContent>
          
          <TabsContent value="events">
            <EventsManagement language={language} t={t} />
          </TabsContent>
          
          <TabsContent value="people">
            <PeopleManagement language={language} t={t} />
          </TabsContent>
          
          <TabsContent value="reposts">
            <RepostsManagement language={language} t={t} />
          </TabsContent>
          
          <TabsContent value="navigation">
            <NavigationManagement language={language} t={t} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

// ============ ARCHIVES MANAGEMENT ============
function ArchivesManagement({ language, t }: any) {
  const { data: archives, isLoading } = trpc.archives.getAll.useQuery();
  const deleteMutation = trpc.archives.delete.useMutation();
  const utils = trpc.useUtils();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this archive item?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      utils.archives.getAll.invalidate();
      toast.success("Archive item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete archive item");
    }
  };

  if (isLoading) return <div>{t("loading")}</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("archives")}</CardTitle>
            <CardDescription>Manage archive items, documents, and historical records</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Archive Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {archives?.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">
                  {getLocalizedContent(item, language, "title")}
                </h3>
                <div className="flex gap-2 mt-2">
                  <Badge variant={item.status === "published" ? "default" : item.status === "review" ? "secondary" : "outline"}>
                    {t(item.status)}
                  </Badge>
                  {item.isFeatured && <Badge variant="default">{t("featured")}</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {archives?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No archive items yet. Click "Add Archive Item" to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============ PHOTOS MANAGEMENT ============
function PhotosManagement({ language, t }: any) {
  const { data: photos, isLoading } = trpc.photos.getAll.useQuery();
  const deleteMutation = trpc.photos.delete.useMutation();
  const utils = trpc.useUtils();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      utils.photos.getAll.invalidate();
      toast.success("Photo deleted successfully");
    } catch (error) {
      toast.error("Failed to delete photo");
    }
  };

  if (isLoading) return <div>{t("loading")}</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("photos")}</CardTitle>
            <CardDescription>Manage photo gallery and historical images</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Photo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos?.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden">
              {item.thumbnailUrl && (
                <img src={item.thumbnailUrl} alt={getLocalizedContent(item, language, "title")} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-semibold mb-2">
                  {getLocalizedContent(item, language, "title")}
                </h3>
                <div className="flex gap-2 mb-2">
                  <Badge variant={item.status === "published" ? "default" : item.status === "review" ? "secondary" : "outline"}>
                    {t(item.status)}
                  </Badge>
                  {item.isFeatured && <Badge variant="default">{t("featured")}</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {photos?.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No photos yet. Click "Add Photo" to upload one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============ POEMS MANAGEMENT ============
function PoemsManagement({ language, t }: any) {
  const { data: poems, isLoading } = trpc.poems.getAll.useQuery();
  const deleteMutation = trpc.poems.delete.useMutation();
  const utils = trpc.useUtils();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this poem?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      utils.poems.getAll.invalidate();
      toast.success("Poem deleted successfully");
    } catch (error) {
      toast.error("Failed to delete poem");
    }
  };

  if (isLoading) return <div>{t("loading")}</div>;

  return (
    <Card>
      <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("poems")}</CardTitle>
              <CardDescription>Manage literary heritage and poetry collection</CardDescription>
            </div>
            <AddPoemDialog>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Poem
              </Button>
            </AddPoemDialog>
          </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {poems?.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">
                  {getLocalizedContent(item, language, "title")}
                </h3>
                {item.poetEn && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {getLocalizedContent(item, language, "poet")}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <Badge variant={item.status === "published" ? "default" : item.status === "review" ? "secondary" : "outline"}>
                    {t(item.status)}
                  </Badge>
                  {item.isFeatured && <Badge variant="default">{t("featured")}</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {poems?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No poems yet. Click "Add Poem" to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============ BOOKS MANAGEMENT ============
function BooksManagement({ language, t }: any) {
  const { data: books, isLoading } = trpc.books.getAll.useQuery();
  const deleteMutation = trpc.books.delete.useMutation();
  const utils = trpc.useUtils();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      utils.books.getAll.invalidate();
      toast.success("Book deleted successfully");
    } catch (error) {
      toast.error("Failed to delete book");
    }
  };

  if (isLoading) return <div>{t("loading")}</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("books")}</CardTitle>
            <CardDescription>Manage books, manuscripts, and publications</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books?.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden">
              {item.coverImageUrl && (
                <img src={item.coverImageUrl} alt={getLocalizedContent(item, language, "title")} className="w-full h-64 object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-semibold mb-1">
                  {getLocalizedContent(item, language, "title")}
                </h3>
                {item.authorEn && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {getLocalizedContent(item, language, "author")}
                  </p>
                )}
                <div className="flex gap-2 mb-2">
                  <Badge variant={item.status === "published" ? "default" : item.status === "review" ? "secondary" : "outline"}>
                    {t(item.status)}
                  </Badge>
                  {item.isFeatured && <Badge variant="default">{t("featured")}</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {books?.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No books yet. Click "Add Book" to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============ HERITAGE MANAGEMENT ============
function HeritageManagement({ language, t }: any) {
  const { data: heritage, isLoading } = trpc.heritage.getAll.useQuery();
  const deleteMutation = trpc.heritage.delete.useMutation();
  const utils = trpc.useUtils();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this heritage entry?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      utils.heritage.getAll.invalidate();
      toast.success("Heritage entry deleted successfully");
    } catch (error) {
      toast.error("Failed to delete heritage entry");
    }
  };

  if (isLoading) return <div>{t("loading")}</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("heritage")}</CardTitle>
            <CardDescription>Manage cultural practices, traditions, and oral histories</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Heritage Entry
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {heritage?.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">
                  {getLocalizedContent(item, language, "title")}
                </h3>
                {item.category && (
                  <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <Badge variant={item.status === "published" ? "default" : item.status === "review" ? "secondary" : "outline"}>
                    {t(item.status)}
                  </Badge>
                  {item.isFeatured && <Badge variant="default">{t("featured")}</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {heritage?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No heritage entries yet. Click "Add Heritage Entry" to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============ EVENTS MANAGEMENT ============
function EventsManagement({ language, t }: any) {
  const { data: events, isLoading } = trpc.events.getAll.useQuery();
  const deleteMutation = trpc.events.delete.useMutation();
  const utils = trpc.useUtils();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      utils.events.getAll.invalidate();
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  if (isLoading) return <div>{t("loading")}</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("events")}</CardTitle>
            <CardDescription>Manage community events, exhibitions, and workshops</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events?.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">
                  {getLocalizedContent(item, language, "title")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(item.startDate).toLocaleDateString()}
                  {item.locationEn && ` • ${getLocalizedContent(item, language, "location")}`}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={item.status === "published" ? "default" : item.status === "review" ? "secondary" : "outline"}>
                    {t(item.status)}
                  </Badge>
                  {item.isFeatured && <Badge variant="default">{t("featured")}</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {events?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No events yet. Click "Add Event" to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============ PEOPLE MANAGEMENT ============
function PeopleManagement({ language, t }: any) {
  const { data: people, isLoading } = trpc.people.getAll.useQuery();
  const deleteMutation = trpc.people.delete.useMutation();
  const utils = trpc.useUtils();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this person?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      utils.people.getAll.invalidate();
      toast.success("Person deleted successfully");
    } catch (error) {
      toast.error("Failed to delete person");
    }
  };

  if (isLoading) return <div>{t("loading")}</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("people")}</CardTitle>
            <CardDescription>Manage notable individuals, contributors, and researchers</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Person
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {people?.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4 flex-1">
                {item.photoUrl && (
                  <img src={item.photoUrl} alt={getLocalizedContent(item, language, "name")} className="w-16 h-16 rounded-full object-cover" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {getLocalizedContent(item, language, "name")}
                  </h3>
                  {item.roleEn && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {getLocalizedContent(item, language, "role")}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Badge variant={item.status === "published" ? "default" : item.status === "review" ? "secondary" : "outline"}>
                      {t(item.status)}
                    </Badge>
                    {item.isFeatured && <Badge variant="default">{t("featured")}</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {people?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No people yet. Click "Add Person" to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============ REPOSTS MANAGEMENT ============
function RepostsManagement({ language, t }: any) {
  const { data: reposts, isLoading } = trpc.reposts.getAll.useQuery();
  const deleteMutation = trpc.reposts.delete.useMutation();
  const utils = trpc.useUtils();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this repost?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      utils.reposts.getAll.invalidate();
      toast.success("Repost deleted successfully");
    } catch (error) {
      toast.error("Failed to delete repost");
    }
  };

  if (isLoading) return <div>{t("loading")}</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("reposts")}</CardTitle>
            <CardDescription>Manage curated external content and reposts</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Repost
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reposts?.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">
                  {getLocalizedContent(item, language, "title")}
                </h3>
                {item.sourceNameEn && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Source: {getLocalizedContent(item, language, "sourceName")}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <Badge variant={item.status === "published" ? "default" : item.status === "review" ? "secondary" : "outline"}>
                    {t(item.status)}
                  </Badge>
                  {item.isFeatured && <Badge variant="default">{t("featured")}</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {reposts?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reposts yet. Click "Add Repost" to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============ NAVIGATION MANAGEMENT ============
function NavigationManagement({ language, t }: any) {
  const { data: navItems, isLoading } = trpc.navigation.getAll.useQuery();
  const deleteMutation = trpc.navigation.delete.useMutation();
  const updateMutation = trpc.navigation.update.useMutation();
  const utils = trpc.useUtils();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this navigation item?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      utils.navigation.getAll.invalidate();
      toast.success("Navigation item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete navigation item");
    }
  };

  const handleToggleActive = async (id: number, currentState: boolean) => {
    try {
      await updateMutation.mutateAsync({ id, isActive: !currentState });
      utils.navigation.getAll.invalidate();
      toast.success(`Navigation item ${!currentState ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error("Failed to update navigation item");
    }
  };

  if (isLoading) return <div>{t("loading")}</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("navigationEditor")}</CardTitle>
            <CardDescription>Manage menu items and navigation structure</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {navItems?.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">
                  {getLocalizedContent(item, language, "label")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{item.url}</p>
                {item.parentId && (
                  <Badge variant="outline" className="mt-2">Submenu Item</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleToggleActive(item.id, item.isActive)}
                >
                  {item.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {navItems?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No navigation items yet. Click "Add Menu Item" to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

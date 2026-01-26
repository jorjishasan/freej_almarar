import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { ContentListing } from "@/components/ContentListing";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Calendar } from "lucide-react";

export default function Events() {
  const { language, t } = useLanguage();
  const { data: allEvents, isLoading: allLoading } = trpc.events.getPublished.useQuery();
  const { data: upcomingEvents, isLoading: upcomingLoading } = trpc.events.getUpcoming.useQuery();

  return (
    <div className="min-h-screen">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="w-full">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <a className="text-xl font-bold hover:opacity-80 transition-opacity">
                Freej AlMarar
              </a>
            </Link>
            
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link href="/admin">
                <Button variant="outline" size="sm">Admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">{t("events")}</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              {language === "en"
                ? "Join our community events, exhibitions, and workshops celebrating our heritage."
                : "انضم إلى فعاليات مجتمعنا والمعارض وورش العمل التي تحتفي بتراثنا."}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="w-full">
          <Tabs defaultValue="upcoming" className="space-y-8">
            <TabsList>
              <TabsTrigger value="upcoming">
                {language === "en" ? "Upcoming Events" : "الفعاليات القادمة"}
              </TabsTrigger>
              <TabsTrigger value="all">
                {language === "en" ? "All Events" : "جميع الفعاليات"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingLoading ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">{t("loading")}</p>
                </div>
              ) : (
                <ContentListing
                  items={upcomingEvents || []}
                  type="event"
                  emptyMessage={
                    language === "en"
                      ? "No upcoming events at the moment."
                      : "لا توجد فعاليات قادمة في الوقت الحالي."
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="all">
              {allLoading ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">{t("loading")}</p>
                </div>
              ) : (
                <ContentListing
                  items={allEvents || []}
                  type="event"
                  emptyMessage={
                    language === "en"
                      ? "No events available yet."
                      : "لا توجد فعاليات متاحة حتى الآن."
                  }
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, ExternalLink, Calendar, Users } from "lucide-react";

export default function OurProjects() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  // Sample projects - replace with real data
  const projects = [
    {
      id: 1,
      titleEn: "Digital Archive Initiative",
      titleAr: "مبادرة الأرشيف الرقمي",
      descriptionEn: "Digitizing and preserving historical documents and photographs",
      descriptionAr: "رقمنة وحفظ الوثائق والصور التاريخية",
      status: "ongoing",
      year: "2024",
    },
    {
      id: 2,
      titleEn: "Oral History Project",
      titleAr: "مشروع التاريخ الشفهي",
      descriptionEn: "Recording and documenting oral histories from community elders",
      descriptionAr: "تسجيل وتوثيق التاريخ الشفهي من كبار المجتمع",
      status: "ongoing",
      year: "2024",
    },
    {
      id: 3,
      titleEn: "Heritage Education Program",
      titleAr: "برنامج التعليم التراثي",
      descriptionEn: "Educational workshops and programs for younger generations",
      descriptionAr: "ورش عمل وبرامج تعليمية للأجيال الشابة",
      status: "planned",
      year: "2025",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="container py-12">
          <h1 className="text-4xl font-bold mb-4">
            {isArabic ? "مشاريعنا" : "Our Projects"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isArabic
              ? "المبادرات والمشاريع التي نعمل عليها"
              : "Initiatives and projects we're working on"}
          </p>
        </div>
      </div>

      <div className="container py-12">
        {/* Introduction */}
        <Card className="p-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {isArabic ? "مبادراتنا" : "Our Initiatives"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isArabic
                  ? "نعمل على مجموعة من المشاريع والمبادرات التي تهدف إلى حفظ وتوثيق ونشر التراث الثقافي لفريج المرر. نرحب بالتعاون والمشاركة في هذه المشاريع."
                  : "We work on a range of projects and initiatives aimed at preserving, documenting, and disseminating the cultural heritage of Freej AlMarar. We welcome collaboration and participation in these projects."}
              </p>
            </div>
          </div>
        </Card>

        {/* Projects List */}
        <div className="space-y-6">
          {projects.map((project) => (
            <Card key={project.id} className="p-8 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  {/* Status Badge */}
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                    style={{
                      backgroundColor: project.status === "ongoing" ? "rgba(34, 197, 94, 0.1)" : "rgba(59, 130, 246, 0.1)",
                      color: project.status === "ongoing" ? "rgb(34, 197, 94)" : "rgb(59, 130, 246)"
                    }}
                  >
                    {project.status === "ongoing"
                      ? (isArabic ? "جاري التنفيذ" : "Ongoing")
                      : (isArabic ? "مخطط" : "Planned")}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3">
                    {isArabic ? project.titleAr : project.titleEn}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4">
                    {isArabic ? project.descriptionAr : project.descriptionEn}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{project.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{isArabic ? "مشروع مجتمعي" : "Community Project"}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="gap-2">
                    {isArabic ? "المزيد" : "Learn More"}
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  {project.status === "ongoing" && (
                    <Button variant="default" className="gap-2">
                      {isArabic ? "شارك معنا" : "Get Involved"}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="p-8 mt-12 bg-primary/5">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              {isArabic ? "هل لديك فكرة مشروع؟" : "Have a project idea?"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isArabic
                ? "نرحب بأفكاركم ومقترحاتكم لمشاريع جديدة تساهم في حفظ التراث"
                : "We welcome your ideas and suggestions for new projects that contribute to heritage preservation"}
            </p>
            <Button size="lg" className="gap-2">
              {isArabic ? "شارك فكرتك" : "Share Your Idea"}
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

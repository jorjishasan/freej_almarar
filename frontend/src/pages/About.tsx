import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Info, Target, Users, Heart } from "lucide-react";

export default function About() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="container py-12">
          <h1 className="text-4xl font-bold mb-4">
            {isArabic ? "عن فريج المرر" : "About Freej AlMarar"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isArabic
              ? "حفظ تراثنا الثقافي للأجيال القادمة"
              : "Preserving our cultural heritage for future generations"}
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Mission */}
          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {isArabic ? "مهمتنا" : "Our Mission"}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "نسعى إلى جمع وحفظ وتوثيق التراث الثقافي والتاريخي لفريج المرر، وإتاحته للأجيال الحالية والمستقبلية من خلال أرشيف رقمي شامل ومنظم."
                    : "We strive to collect, preserve, and document the cultural and historical heritage of Freej AlMarar, making it accessible to current and future generations through a comprehensive and organized digital archive."}
                </p>
              </div>
            </div>
          </Card>

          {/* Vision */}
          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {isArabic ? "رؤيتنا" : "Our Vision"}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "أن نكون المرجع الأول والأشمل للتراث الثقافي والتاريخي لفريج المرر، ومنصة تفاعلية تربط الأجيال وتحافظ على الهوية الثقافية."
                    : "To be the primary and most comprehensive reference for the cultural and historical heritage of Freej AlMarar, and an interactive platform that connects generations and preserves cultural identity."}
                </p>
              </div>
            </div>
          </Card>

          {/* Values */}
          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {isArabic ? "قيمنا" : "Our Values"}
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{isArabic ? "الأصالة: الحفاظ على التراث الأصيل دون تحريف" : "Authenticity: Preserving genuine heritage without distortion"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{isArabic ? "الشمولية: جمع كافة جوانب التراث الثقافي والتاريخي" : "Comprehensiveness: Collecting all aspects of cultural and historical heritage"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{isArabic ? "التعاون: العمل مع المجتمع والباحثين والمؤسسات" : "Collaboration: Working with the community, researchers, and institutions"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{isArabic ? "الاستدامة: ضمان حفظ التراث للأجيال القادمة" : "Sustainability: Ensuring heritage preservation for future generations"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Team */}
          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {isArabic ? "فريقنا" : "Our Team"}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "يتكون فريقنا من مجموعة من المتطوعين والباحثين والمهتمين بالتراث الثقافي، الذين يعملون بشغف على جمع وتوثيق تراث فريج المرر."
                    : "Our team consists of volunteers, researchers, and cultural heritage enthusiasts who work passionately to collect and document the heritage of Freej AlMarar."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

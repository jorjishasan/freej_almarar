import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Send, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";

export default function Contribute() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Connect to trpc.submissions.create when backend is ready
    setTimeout(() => {
      setIsSubmitting(false);
      alert(isArabic ? "شكراً لمساهمتك!" : "Thank you for your contribution!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-accent/50 to-background border-b pt-20">
        <div className="container py-12">
          <h1 className="text-4xl font-bold mb-4">
            {isArabic ? "المساهمة" : "Contribute"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isArabic
              ? "شارك معنا في حفظ التراث"
              : "Help us preserve our heritage"}
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          {/* Introduction */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {isArabic ? "كيف يمكنك المساهمة؟" : "How can you contribute?"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {isArabic
                ? "نرحب بمساهماتكم في إثراء الأرشيف من خلال مشاركة الوثائق، الصور، القصائد، الكتب، أو أي محتوى تراثي آخر. جميع المساهمات تخضع للمراجعة قبل النشر."
                : "We welcome your contributions to enrich the archive by sharing documents, photos, poems, books, or any other heritage content. All contributions are reviewed before publication."}
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">{isArabic ? "ما نبحث عنه:" : "What we're looking for:"}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {isArabic ? "وثائق تاريخية" : "Historical documents"}</li>
                  <li>• {isArabic ? "صور قديمة" : "Old photographs"}</li>
                  <li>• {isArabic ? "قصائد وأشعار" : "Poems and poetry"}</li>
                  <li>• {isArabic ? "كتب ومخطوطات" : "Books and manuscripts"}</li>
                  <li>• {isArabic ? "قصص شفهية" : "Oral histories"}</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">{isArabic ? "المتطلبات:" : "Requirements:"}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {isArabic ? "محتوى أصيل وموثوق" : "Authentic and reliable content"}</li>
                  <li>• {isArabic ? "معلومات واضحة عن المصدر" : "Clear source information"}</li>
                  <li>• {isArabic ? "إذن بالنشر إن لزم" : "Publication permission if needed"}</li>
                  <li>• {isArabic ? "جودة جيدة للملفات" : "Good file quality"}</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Submission Form */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">
              {isArabic ? "نموذج المساهمة" : "Contribution Form"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{isArabic ? "الاسم" : "Name"} *</Label>
                  <Input id="name" required placeholder={isArabic ? "اسمك الكامل" : "Your full name"} />
                </div>
                <div>
                  <Label htmlFor="contact">{isArabic ? "البريد الإلكتروني أو رقم الهاتف" : "Email or Phone"} *</Label>
                  <Input id="contact" required placeholder={isArabic ? "للتواصل معك" : "To contact you"} />
                </div>
              </div>

              {/* Content Type */}
              <div>
                <Label htmlFor="contentType">{isArabic ? "نوع المحتوى" : "Content Type"} *</Label>
                <select
                  id="contentType"
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">{isArabic ? "اختر نوع المحتوى" : "Select content type"}</option>
                  <option value="document">{isArabic ? "وثيقة" : "Document"}</option>
                  <option value="photo">{isArabic ? "صورة" : "Photo"}</option>
                  <option value="poem">{isArabic ? "قصيدة" : "Poem"}</option>
                  <option value="book">{isArabic ? "كتاب" : "Book"}</option>
                  <option value="oral_history">{isArabic ? "قصة شفهية" : "Oral History"}</option>
                  <option value="other">{isArabic ? "أخرى" : "Other"}</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">{isArabic ? "العنوان" : "Title"}</Label>
                <Input id="title" placeholder={isArabic ? "عنوان المحتوى" : "Content title"} />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">{isArabic ? "الوصف" : "Description"} *</Label>
                <Textarea
                  id="description"
                  required
                  rows={4}
                  placeholder={isArabic ? "صف المحتوى بالتفصيل..." : "Describe the content in detail..."}
                />
              </div>

              {/* Date/Period */}
              <div>
                <Label htmlFor="period">{isArabic ? "التاريخ أو الفترة الزمنية" : "Date or Time Period"}</Label>
                <Input id="period" placeholder={isArabic ? "مثال: 1950، أو الخمسينيات" : "e.g., 1950, or 1950s"} />
              </div>

              {/* Place */}
              <div>
                <Label htmlFor="place">{isArabic ? "المكان" : "Place"}</Label>
                <Input id="place" placeholder={isArabic ? "المكان المرتبط بالمحتوى" : "Place related to the content"} />
              </div>

              {/* File Upload */}
              <div>
                <Label htmlFor="files">{isArabic ? "الملفات" : "Files"}</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Button type="button" variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    {isArabic ? "اختر الملفات" : "Choose Files"}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {isArabic ? "يمكنك رفع عدة ملفات" : "You can upload multiple files"}
                  </span>
                </div>
              </div>

              {/* Permission */}
              <div className="flex items-start gap-2">
                <input type="checkbox" id="permission" required className="mt-1" />
                <Label htmlFor="permission" className="font-normal cursor-pointer">
                  {isArabic
                    ? "أؤكد أن لدي الإذن بنشر هذا المحتوى وأنه لا ينتهك أي حقوق ملكية فكرية"
                    : "I confirm that I have permission to publish this content and it does not violate any intellectual property rights"}
                </Label>
              </div>

              {/* Submit */}
              <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                <Send className="h-4 w-4" />
                {isSubmitting
                  ? (isArabic ? "جاري الإرسال..." : "Submitting...")
                  : (isArabic ? "إرسال المساهمة" : "Submit Contribution")}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

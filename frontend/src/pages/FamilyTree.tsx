import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type TribeSection = {
  id: string;
  title: string;
  titleAr: string;
  description?: string;
};

// Tribe sections
const TRIBE_SECTIONS: TribeSection[] = [
  { id: "al-rumaythat", title: "Al Rumaythat", titleAr: "الرميثات" },
  { id: "al-malahima", title: "Al Malahima", titleAr: "الملاهمة" },
  { id: "al-masani'a", title: "Al Masani'a", titleAr: "المصانعه" },
  { id: "al-majad'a", title: "Al Majad'a", titleAr: "المجادعه" },
  { id: "al-masa'iba", title: "Al Masa'iba", titleAr: "المصاعبه" },
  { id: "al-bu-rayih", title: "Al Bu Rayih", titleAr: "ال بو رايح" },
  { id: "al-thumayrat", title: "Al Thumayrat", titleAr: "الثميرات" },
  { id: "al-rawashid", title: "Al Rawashid", titleAr: "الرواشد" },
];

export default function FamilyTree() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <section className="py-14 border-b border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">Family Tree</h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Choose a tribe subsection (placeholders). You will fill names/details later.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TRIBE_SECTIONS.map((s) => (
                <Link key={s.id} href={`/family-tree/${s.id}`}>
                  <div className="group cursor-pointer rounded-2xl border border-border bg-card hover:bg-accent/30 transition-colors p-6">
                    <div className="text-xl font-light tracking-tight group-hover:text-primary transition-colors">
                      {s.title}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{s.titleAr}</div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      {s.description ?? "Click to view families"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

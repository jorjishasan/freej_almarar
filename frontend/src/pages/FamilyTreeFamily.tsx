import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function FamilyTreeFamily() {
  const [, params] = useRoute("/family-tree/:sectionId/:familyId");
  const sectionId = params?.sectionId ?? "";
  const familyId = params?.familyId ?? "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <section className="py-14 border-b border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              Family: {familyId}
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Tribe subsection: {sectionId}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-light tracking-tight">Placeholder</h2>
              <p className="mt-2 text-muted-foreground">
                Ready for real content later (branches, documents, photos, etc.).
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

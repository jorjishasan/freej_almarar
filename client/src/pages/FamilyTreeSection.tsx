import { Link, useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Placeholder families (edit later)
const PLACEHOLDER_FAMILIES = [
  "Family 1",
  "Family 2",
  "Family 3",
  "Family 4",
  "Family 5",
  "Family 6",
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function FamilyTreeSection() {
  const [, params] = useRoute("/family-tree/:sectionId");
  const sectionId = params?.sectionId ?? "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <section className="py-14 border-b border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              Section: {sectionId}
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Families list for this tribe subsection (placeholders for now).
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PLACEHOLDER_FAMILIES.map((name) => {
                const familyId = slugify(name);
                return (
                  <Link key={name} href={`/family-tree/${sectionId}/${familyId}`}>
                    <div className="group cursor-pointer rounded-2xl border border-border bg-card hover:bg-accent/30 transition-colors p-6">
                      <div className="text-xl font-light tracking-tight group-hover:text-primary transition-colors">
                        {name}
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground">
                        Click to open family details
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

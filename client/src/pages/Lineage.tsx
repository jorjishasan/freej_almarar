import { Link } from "wouter";
import { TreePine, AlertTriangle } from "lucide-react";

export default function Lineage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="w-full">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-light tracking-wide text-foreground hover:text-primary transition-colors">
              Freej AlMarar
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/history" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">History</Link>
              <Link href="/archive" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">Archive</Link>
              <Link href="/ferjan" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">Ferjan</Link>
              <Link href="/lineage" className="text-sm font-light text-foreground">Lineage</Link>
              <Link href="/figures" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">Figures</Link>
              <Link href="/poems" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">Poems</Link>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-muted-foreground hover:text-foreground">
                <span className="text-sm">العربية</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden mt-16">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
          style={{
            backgroundImage: `url(/images/aerial-4.jpg)`,
          }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-6xl md:text-7xl font-light text-white mb-6 tracking-tight">
            Family Trees
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl">
            Family tree and notable figures
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 px-4">
        <div className="w-full">
          <div className="grid gap-8 max-w-2xl mx-auto">
            {/* Family Tree Card (Coming Soon) */}
            <div className="group block">
              <div className="relative overflow-hidden rounded-lg border border-border bg-card h-full opacity-60">
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(/images/aerial-1.jpg)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
                  
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-3xl font-light text-white mb-2">
                      Family Tree
                    </h3>
                    <p className="text-white/80">
                      Coming soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Family Tree Sections */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-center mb-8">Family Tree Sections</h2>
            
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <TreePine className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-light text-foreground mb-3">
                No sections available yet
              </h3>
              <p className="text-muted-foreground mb-8">
                Content will be added soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background px-4">
        <div className="w-full">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              © {new Date().getFullYear()} Freej AlMarar Heritage Archive. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

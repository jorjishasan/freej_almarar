import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-light mb-3 tracking-wide">Freej AlMarar</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Preserving our cultural heritage for future generations through
              documents, photographs, poems, and oral traditions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium mb-4 tracking-wide">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  History
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Archive
                </Link>
              </li>
              <li>
                <Link href="/ferjan" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Ferjan
                </Link>
              </li>
              <li>
                <Link href="/family-tree" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Family Tree
                </Link>
              </li>
              <li>
                <Link href="/figures" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Figures
                </Link>
              </li>
              <li>
                <Link href="/poems" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Poems
                </Link>
              </li>
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="text-sm font-medium mb-4 tracking-wide">About</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contribute" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contribute
                </Link>
              </li>
              <li>
                <Link href="/our-projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Our Projects
                </Link>
              </li>
              <li>
                <Link href="/collaborations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Collaborations
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} Freej AlMarar Heritage Archive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

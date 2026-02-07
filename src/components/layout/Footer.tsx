import { Link } from "react-router-dom";
import { Home, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">
                UOttawa <span className="text-primary">Housing Hub</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Helping University of Ottawa students find their perfect roommate and
              housing.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/roommate-finder" className="hover:text-primary">
                  Roommate Finder
                </Link>
              </li>
              <li>
                <Link to="/housing-map" className="hover:text-primary">
                  Housing Map
                </Link>
              </li>
              <li>
                <Link to="/lease-checker" className="hover:text-primary">
                  Lease Checker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/resources/student-housing-guide"
                  className="hover:text-primary"
                >
                  Student Housing Guide
                </Link>
              </li>
              <li>
                <Link to="/resources/roommate-tips" className="hover:text-primary">
                  Roommate Tips
                </Link>
              </li>
              <li>
                <Link to="/resources/lease-faq" className="hover:text-primary">
                  Lease FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Connect</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@uottawahousing.app"
                className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Email support"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} UOttawa Housing Hub. Made with ❤️ for
            students.
          </p>
        </div>
      </div>
    </footer>
  );
}

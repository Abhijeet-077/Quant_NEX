import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-background border-t border-border p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground">© 2023 Quantum-AI Precision Oncology Suite</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Version 1.2.0 - Powered by Quantum Computing</p>
        </div>
        <div className="flex space-x-6">
          <Link href="#">
            <a className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</a>
          </Link>
          <Link href="#">
            <a className="text-sm text-muted-foreground hover:text-primary">Terms of Service</a>
          </Link>
          <Link href="#">
            <a className="text-sm text-muted-foreground hover:text-primary">Help Center</a>
          </Link>
        </div>
      </div>
    </footer>
  );
}

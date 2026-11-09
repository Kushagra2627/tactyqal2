import "./globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Navbar from "@/components/Navbar";
import { company } from "@/lib/data";
import { Sparkles, Mail, Phone, Heart } from "lucide-react";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Figtree({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: {
    default: "Tactyqal Labs — 1:1 Startup Mentorship for Teens",
    template: "%s | Tactyqal Labs"
  },
  description:
    "1:1 mentoring for teens to build real full-stack apps with modern no-code and AI tools in 8 weeks.",
  openGraph: {
    title: "Tactyqal Labs — Teen Startup Mentorship",
    description: "Empower your kid to build the next app that impacts millions, in 8 weeks.",
    type: "website"
  }
};

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} scroll-smooth`}>
      <body className="min-h-screen bg-mist text-ink font-sans antialiased flex flex-col justify-between">
        <Navbar />

        <div className="flex-1">{children}</div>

        {/* Footer */}
        <footer className="mt-20 border-t border-line/20 bg-ink px-4 py-14 text-white">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 pb-12 border-b border-white/10">
              {/* Brand Info */}
              <div className="lg:col-span-5">
                <div className="flex items-center gap-2 font-display text-xl font-bold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lagoon text-white">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span>Tactyqal Labs</span>
                </div>
                <p className="mt-3 max-w-sm text-sm text-white/70 leading-relaxed">
                  Empowering the next generation of founders through hands-on 1:1 mentorship and real app creation in 8 weeks.
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-white/60">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-lagoon" /> {company.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-lagoon" /> {company.phone}
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="lg:col-span-3">
                <h4 className="font-display text-sm font-bold tracking-wider text-white uppercase">
                  Programs
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-white/70">
                  <li><a href="/#program" className="hover:text-white transition-colors">8-Week Roadmap</a></li>
                  <li><a href="/#stories" className="hover:text-white transition-colors">Success Stories</a></li>
                  <li><a href="/#tools" className="hover:text-white transition-colors">Assessment Tools</a></li>
                  <li><a href="/blog" className="hover:text-white transition-colors">Insights & Articles</a></li>
                </ul>
              </div>

              {/* Consultation Callout */}
              <div className="lg:col-span-4">
                <h4 className="font-display text-sm font-bold tracking-wider text-white uppercase">
                  Admissions
                </h4>
                <p className="mt-3 text-sm text-white/70">
                  Applications are accepted on a rolling basis. Spots are limited to ensure 1:1 quality.
                </p>
                <div className="mt-4">
                  <a
                    href={company.booking}
                    className="inline-flex items-center gap-2 rounded-lg bg-lagoon px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-lagoon-dark transition-all"
                  >
                    Schedule Free Consultation
                  </a>
                </div>
              </div>
            </div>

            {/* Sub-footer */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-white/50 sm:flex-row">
              <p>© {new Date().getFullYear()} Tactyqal Labs. All rights reserved.</p>
              <div className="flex gap-4">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <a href="/admin/login" className="hover:text-white/80 transition-colors">
                  Admin Portal
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

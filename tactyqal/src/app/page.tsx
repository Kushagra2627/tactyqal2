import HeroSection from "@/components/HeroSection";
import MentorshipSection from "@/components/MentorshipSection";
import StoriesSection from "@/components/StoriesSection";
import ToolsSection from "@/components/ToolsSection";
import BlogPreviewSection from "@/components/BlogPreviewSection";
import FaqAccordion from "@/components/FaqAccordion";
import ContactForm from "@/components/ContactForm";
import { company, seedPosts } from "@/lib/data";
import { Mail, Phone, Clock, MapPin, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* 1. Hero Section with Cinematic Background Video */}
      <HeroSection />

      {/* 2. Mentorship & Collaboration Video Showcase */}
      <MentorshipSection />

      {/* 3. Real Student Success Stories */}
      <StoriesSection />

      {/* 4. Free Startup Assessment Tools */}
      <ToolsSection />

      {/* 5. Dynamic Blog Preview */}
      <BlogPreviewSection posts={seedPosts.slice(0, 3)} />

      {/* 6. Questions Parents Ask Accordion */}
      <FaqAccordion />

      {/* 7. Contact Section */}
      <section id="contact" className="relative bg-mist/60 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-12 md:items-start">
          {/* Contact Details */}
          <div className="md:col-span-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lagoon/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-lagoon">
              <Sparkles className="h-3.5 w-3.5" /> Start the Journey
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Talk to our founding team
            </h2>
            <p className="mt-3 text-base text-ink/75 leading-relaxed">
              Have questions about our 8-week mentoring program? Reach out directly to discuss your teen's interests, schedule, and goals.
            </p>

            <div className="mt-8 space-y-4 text-sm font-medium text-ink/80">
              <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-lagoon/10 text-lagoon">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-ink/50 font-normal">Direct Email</p>
                  <a href={`mailto:${company.email}`} className="font-semibold text-ink hover:text-lagoon transition-colors">
                    {company.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-lagoon/10 text-lagoon">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-ink/50 font-normal">Phone / WhatsApp</p>
                  <a href={`tel:${company.phone}`} className="font-semibold text-ink hover:text-lagoon transition-colors">
                    {company.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-lagoon/10 text-lagoon">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-ink/50 font-normal">Admissions Hours</p>
                  <p className="font-semibold text-ink">{company.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="md:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}

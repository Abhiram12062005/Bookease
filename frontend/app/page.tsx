import { CTA } from "./components/landing/cta";
import { FAQ } from "./components/landing/faq";
import { Features } from "./components/landing/features";
import { Footer } from "./components/landing/footer";
import { Hero } from "./components/landing/hero";
import { HowItWorks } from "./components/landing/how-it-works";
import { LogoBar } from "./components/landing/logo-bar";
import { Modules } from "./components/landing/modules";
import { Navbar } from "./components/landing/navbar";
import { Pricing } from "./components/landing/pricing";
import { Stats } from "./components/landing/stats";
import { TemplateShowcase } from "./components/landing/template-showcase";
import { Testimonials } from "./components/landing/testimonials";

export default function Home() {
  return (
    <main className="w-full bg-[#0A0A0F]">
      <Navbar />
      <Hero />
      <LogoBar />
      <HowItWorks />
      <Features />
      <TemplateShowcase />
      <Modules />
      <Stats />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}

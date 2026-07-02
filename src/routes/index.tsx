import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import {
  Catalog, FeaturedParts, Aircraft, HowItWorks, Services,
  Manufacturers, Testimonials, CTA, Footer,
} from "@/components/site/Sections";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Manufacturers />
        <Catalog />
        <FeaturedParts />
        <Aircraft />
        <HowItWorks />
        <Services />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

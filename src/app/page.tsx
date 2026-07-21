import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { Marquee } from '@/components/home/Marquee';
import { Workflow } from '@/components/home/Workflow';
import { TechGrid } from '@/components/home/TechGrid';
import { Metrics } from '@/components/home/Metrics';
import { Projects } from '@/components/home/Projects';
import { Showreel } from '@/components/home/Showreel';
import { About } from '@/components/home/About';
import { ContactCTA } from '@/components/home/ContactCTA';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Workflow />
        <TechGrid />
        <Metrics />
        <Projects />
        <Showreel />
        <About />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}

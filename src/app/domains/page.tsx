import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DomainsExperience } from '@/components/domains/DomainsExperience';

export const metadata: Metadata = {
  title: 'Domains',
  description:
    'Deep dives into Neuroscience, AI Agents, and Aerospace — the fields shaping the future.',
};

/* Stays a server component so the metadata above still ships; the scroll-driven
   experience is the only part that needs the client. */
export default function DomainsPage() {
  return (
    <>
      <Header />
      <main>
        <DomainsExperience />
      </main>
      <Footer />
    </>
  );
}

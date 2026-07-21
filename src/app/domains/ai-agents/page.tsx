import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EditorialHero } from '@/components/domains/EditorialHero';
import { AIAgentsDirectory } from '@/components/domains/AIAgentsDirectory';

export const metadata: Metadata = {
  title: 'AI Agents Directory',
  description:
    'A curated directory of leading AI agent platforms across assistants, analytics, coding, customer service, content, and more.',
};

export default function AIAgentsPage() {
  return (
    <>
      <Header />
      <main>
        <EditorialHero />
        <AIAgentsDirectory />
      </main>
      <Footer />
    </>
  );
}

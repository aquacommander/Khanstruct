import { Header } from '@/components/site/Header';
import { Hero } from '@/components/site/Hero';

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
      </main>
    </>
  );
}

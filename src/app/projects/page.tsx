import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { PROJECTS } from '@/lib/content';
import styles from './projects.module.css';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'A selection of projects across design, data engineering, and AI implementation by Zain Khan / Khanstruct.',
};

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main>
        <section className={styles.hero}>
          <div className={styles.inner}>
            <p className={`label ${styles.label}`}>Selected Work</p>
            <h1 className={styles.heading}>
              Real<br />
              <em>deliverables.</em>
            </h1>
            <p className={styles.desc}>
              Production deployments, competition submissions, and community systems — not mockups.
            </p>
          </div>
        </section>

        <section className={styles.grid} aria-labelledby="projects-list-heading">
          <div className={styles.inner}>
            <h2 id="projects-list-heading" className="sr-only">All Projects</h2>
            <div className={styles.cards}>
              {PROJECTS.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

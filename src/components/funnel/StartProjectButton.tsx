'use client';

import { useFunnel } from '@/store/funnel';

type Props = {
  className?: string;
  children: React.ReactNode;
  'aria-label'?: string;
  'data-delay'?: string; // scroll-reveal stagger hook
};

/** Opens the "Start a Project" lead funnel. Use anywhere a primary
    project-intake CTA is needed (contact section, hero, header). */
export function StartProjectButton({ className, children, ...rest }: Props) {
  const openFunnel = useFunnel((s) => s.openFunnel);
  return (
    <button type="button" className={className} onClick={openFunnel} {...rest}>
      {children}
    </button>
  );
}

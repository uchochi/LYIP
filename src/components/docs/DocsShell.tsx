import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import '../../docs.css';

export interface DocsNavItem {
  label: string;
  /** Route link, e.g. "/start/prodigy". */
  to?: string;
  /** In-page anchor id, e.g. "step-1" (scroll-spy highlights it). */
  anchor?: string;
}

export interface DocsNavGroup {
  title: string;
  items: DocsNavItem[];
}

interface DocsShellProps {
  groups: DocsNavGroup[];
  breadcrumb: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function DocsShell({
  groups,
  breadcrumb,
  title,
  description,
  children,
  footer,
}: DocsShellProps) {
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  // --- scroll-spy for in-page anchor items ---
  const [activeAnchor, setActiveAnchor] = useState<string>('');

  useEffect(() => {
    const anchors = groups
      .flatMap((g) => g.items)
      .filter((i) => i.anchor)
      .map((i) => i.anchor as string);
    if (anchors.length === 0) return;

    const observers: IntersectionObserver[] = [];
    anchors.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActiveAnchor(id);
          });
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [groups]);

  const isActive = (item: DocsNavItem): boolean => {
    if (item.anchor) return activeAnchor === item.anchor;
    if (item.to === '/start') return pathname === '/start';
    if (item.to) return pathname === item.to || pathname.startsWith(item.to + '/');
    return false;
  };

  const renderItem = (item: DocsNavItem) => {
    const active = isActive(item);
    const className = `docs-nav-link${active ? ' active' : ''}`;
    if (item.anchor) {
      return (
        <a key={item.label} href={`#${item.anchor}`} className={className}>
          {item.label}
        </a>
      );
    }
    return (
      <Link key={item.label} to={item.to ?? '#'} className={className}>
        {item.label}
      </Link>
    );
  };

  return (
    <div className="docs-layout">
      {/* top scroll progress */}
      <div className="docs-progress" aria-hidden>
        <motion.span style={{ scaleX: progress }} />
      </div>

      {/* sidebar */}
      <aside className="docs-sidebar">
        {groups.map((group) => (
          <div key={group.title} className="docs-nav-group">
            <div className="docs-nav-title">{group.title}</div>
            {group.items.map(renderItem)}
          </div>
        ))}
      </aside>

      {/* main */}
      <main className="docs-main">
        <header className="docs-header">
          <div className="docs-breadcrumb">{breadcrumb}</div>
          <h1>{title}</h1>
          <p className="docs-description">{description}</p>
        </header>

        {children}

        {footer && <div className="docs-footer">{footer}</div>}
      </main>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import FAQAccordion from '../components/FAQAccordion';
import { DATASET_FAQS } from '../content/faq';
import Reveal from '../components/start/Reveal';

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Reveal>
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HelpCircle size={26} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl">
            Dataset Curation FAQ
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-text-muted">
            Everything a new curator needs to know about submitting datasets, reviews, and getting paid.
          </p>
        </div>
      </Reveal>

      <FAQAccordion items={DATASET_FAQS} />

      <Reveal>
        <div className="mt-12 rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="text-text-muted">Still have questions?</p>
          <Link
            to="/submit"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Start submitting →
          </Link>
        </div>
      </Reveal>
    </div>
  );
}

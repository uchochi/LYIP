import { FileText } from 'lucide-react';

const papers = [
  { title: 'Scaling Data Curation: Lessons from Building Training Corpora', authors: 'J. Chen, A. Patel, M. Rodriguez et al.', venue: 'NeurIPS 2026', abstract: 'We present the techniques used to build our largest multilingual training corpora, achieving state-of-the-art quality on data benchmarks while maintaining consistency across 12 languages.' },
  { title: 'Real-Time Data Quality Detection in AI Training Sets', authors: 'S. Kim, L. Wang, R. Gupta', venue: 'ICML 2026', abstract: 'A lightweight, production-deployable system for detecting noise, duplicates, and alignment errors in training datasets with 94% precision and sub-millisecond latency.' },
  { title: 'Constitutional Data: A Practical Framework for Ethical Curation', authors: 'A. Patel, J. Chen, D. Thompson', venue: 'ICLR 2026', abstract: 'We describe a practical framework for applying ethical curation principles in production dataset pipelines, including review methodology and failure mode analysis.' },
  { title: 'Efficient Dataset Structuring: Dynamic Schema Adaptation', authors: 'M. Rodriguez, S. Kim', venue: 'arXiv 2026', abstract: 'An improvement to dataset structuring that dynamically adapts schemas during conversion, achieving comparable quality to hand-crafted formats at a fraction of the effort.' },
  { title: 'Measuring What Matters: New Benchmarks for Data Trustworthiness', authors: 'L. Wang, J. Chen, A. Patel, D. Thompson', venue: 'NeurIPS 2025', abstract: 'We introduce a comprehensive benchmark suite for evaluating dataset trustworthiness across cleanliness, alignment, coverage, and bias dimensions.' },
];

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-main">Research</h1>
      <p className="mt-3 max-w-xl text-lg text-text-muted">
        Our published papers and ongoing research in data curation, dataset quality, and AI training data.
      </p>

      <div className="mt-12 space-y-6">
        {papers.map((p) => (
          <div key={p.title} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              <span className="text-xs font-medium text-primary">{p.venue}</span>
            </div>
            <h2 className="text-lg font-semibold text-text-main">{p.title}</h2>
            <p className="mt-1 text-xs text-text-muted">{p.authors}</p>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">{p.abstract}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

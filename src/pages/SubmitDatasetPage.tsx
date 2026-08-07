import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Upload,
  File as FileIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Link2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  createSubmission,
  validateFile,
  extOf,
  MAX_FILE_BYTES,
  ALLOWED_EXTS,
} from '../services/datasetService';
import { DATASET_CATEGORIES, OTHER_SLUG } from '../content/datasets';
import { DATASET_FAQS } from '../content/faq';
import FAQAccordion from '../components/FAQAccordion';
import Reveal from '../components/start/Reveal';

type Method = 'upload' | 'link';

export default function SubmitDatasetPage() {
  const { isAuthenticated, user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [entryCount, setEntryCount] = useState('');
  const [method, setMethod] = useState<Method>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [datasetUrl, setDatasetUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [rights, setRights] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<null | { title: string }>(null);

  // --- Not signed in -------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck size={26} />
        </div>
        <h1 className="text-2xl font-bold text-text-main">Sign in to submit a dataset</h1>
        <p className="mt-2 text-text-muted">
          You need an account so we can review your submission and send you feedback and pricing.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            to="/login"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-main transition-colors hover:bg-surface-lighter"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  // --- Success state -------------------------------------------------------
  if (done) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400"
        >
          <CheckCircle2 size={34} />
        </motion.div>
        <h1 className="text-3xl font-extrabold text-text-main">Dataset submitted!</h1>
        <p className="mt-3 text-text-muted">
          <span className="font-semibold text-text-main">“{done.title}”</span> is now in our review queue. We'll
          get back to you with feedback and a proposed price within a few business days. Track its status in your
          dashboard.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/dashboard"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Go to dashboard
          </Link>
          <button
            type="button"
            onClick={() => {
              setDone(null);
              setTitle('');
              setDescription('');
              setCategory('');
              setCustomCategory('');
              setEntryCount('');
              setFile(null);
              setDatasetUrl('');
              setRights(false);
            }}
            className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-main transition-colors hover:bg-surface-lighter"
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  const onPickFile = (f: File | null) => {
    if (!f) return;
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
      return;
    }
    setError('');
    setFile(f);
    setMethod('upload');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) return setError('Please give your dataset a title.');
    if (!category) return setError('Please choose a category.');
    if (category === OTHER_SLUG && !customCategory.trim()) return setError('Please type your custom category.');
    if (!rights) return setError('Please confirm you have the rights to this data.');
    if (method === 'upload' && !file) return setError('Please choose a file to upload.');
    if (method === 'link' && !datasetUrl.trim()) return setError('Please paste a link to your dataset.');

    setLoading(true);
    try {
      const result = await createSubmission({
        title,
        description,
        category,
        customCategory,
        entryCount: entryCount ? Number(entryCount) : undefined,
        datasetUrl: method === 'link' ? datasetUrl : datasetUrl || undefined,
        file: method === 'upload' ? file : null,
      });
      setDone({ title: result.title });
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Reveal>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">Submit a Dataset</h1>
          <p className="mt-2 text-text-muted">
            Upload your cleaned, categorized dataset. Our team reviews it and proposes a price — usually{' '}
            <span className="font-semibold text-text-main">$50–$100</span> per dataset.
          </p>
        </div>
      </Reveal>

      <form onSubmit={onSubmit} className="space-y-7">
        {/* Title */}
        <Reveal>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text-main">Dataset title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Yoruba Proverbs Collection"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text-main outline-none transition-colors placeholder:text-zinc-600 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </Reveal>

        {/* Description */}
        <Reveal>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text-main">
              Description <span className="font-normal text-text-muted">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Briefly describe what the dataset contains, its source, and how it's structured."
              className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 text-text-main outline-none transition-colors placeholder:text-zinc-600 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </Reveal>

        {/* Category */}
        <Reveal>
          <div>
            <label className="mb-2 block text-sm font-semibold text-text-main">Category *</label>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {DATASET_CATEGORIES.map((c) => {
                const selected = category === c.slug;
                const isOther = c.slug === OTHER_SLUG;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setCategory(selected ? '' : c.slug)}
                    className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all ${
                      selected
                        ? 'border-primary/60 bg-primary/10 ring-1 ring-primary/30'
                        : 'border-border bg-surface hover:border-border-strong hover:bg-surface-lighter'
                    }`}
                  >
                    <span className="text-xl leading-none">{c.emoji}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-text-main">{c.label}</span>
                      <span className="block text-xs text-text-muted">{isOther ? 'Type your own' : c.blurb}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {category === OTHER_SLUG && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                <input
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Type your custom category…"
                  className="mt-3 w-full rounded-lg border border-border bg-surface px-4 py-3 text-text-main outline-none transition-colors placeholder:text-zinc-600 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                />
              </motion.div>
            )}
          </div>
        </Reveal>

        {/* Entry count */}
        <Reveal>
          <div className="max-w-[220px]">
            <label className="mb-1.5 block text-sm font-semibold text-text-main">
              Approx. entries <span className="font-normal text-text-muted">(optional)</span>
            </label>
            <input
              type="number"
              min={0}
              value={entryCount}
              onChange={(e) => setEntryCount(e.target.value)}
              placeholder="e.g. 1500"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text-main outline-none transition-colors placeholder:text-zinc-600 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </Reveal>

        {/* Method tabs */}
        <Reveal>
          <div>
            <label className="mb-2 block text-sm font-semibold text-text-main">Your dataset *</label>
            <div className="mb-3 inline-flex rounded-lg border border-border bg-surface p-1">
              <button
                type="button"
                onClick={() => setMethod('upload')}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  method === 'upload' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'
                }`}
              >
                <Upload size={14} className="mr-1.5 inline" /> Upload file
              </button>
              <button
                type="button"
                onClick={() => setMethod('link')}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  method === 'link' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'
                }`}
              >
                <Link2 size={14} className="mr-1.5 inline" /> External link
              </button>
            </div>

            {method === 'upload' ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.csv,.txt,.parquet"
                  className="hidden"
                  onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                />
                {!file ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      onPickFile(e.dataTransfer.files?.[0] ?? null);
                    }}
                    className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                      dragOver
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-surface hover:border-primary/40 hover:bg-surface-lighter'
                    }`}
                  >
                    <Upload size={28} className="mb-3 text-text-muted" />
                    <span className="font-semibold text-text-main">Drop your file here, or click to browse</span>
                    <span className="mt-1 text-xs text-text-muted">
                      .{ALLOWED_EXTS.join(', .')} · up to {Math.round(MAX_FILE_BYTES / 1024 / 1024)} MB
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileIcon size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text-main">{file.name}</p>
                      <p className="text-xs text-text-muted">
                        {(file.size / 1024).toFixed(1)} KB · {extOf(file.name).toUpperCase()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-lighter hover:text-red-400"
                      aria-label="Remove file"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <input
                value={datasetUrl}
                onChange={(e) => setDatasetUrl(e.target.value)}
                placeholder="https://drive.google.com/… or https://huggingface.co/…"
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text-main outline-none transition-colors placeholder:text-zinc-600 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            )}
          </div>
        </Reveal>

        {/* Rights */}
        <Reveal>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-4">
            <input
              type="checkbox"
              checked={rights}
              onChange={(e) => setRights(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            />
            <span className="text-sm text-text-muted">
              I confirm I have the rights to this data and grant LYIP a license to use it for AI training and
              research. It contains no private personal information I don't have permission to share.
            </span>
          </label>
        </Reveal>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <Reveal>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Submitting…
              </>
            ) : (
              <>Submit for review</>
            )}
          </button>
          <p className="mt-2 text-xs text-text-muted">
            Submitting as <span className="font-medium text-text-main">{user?.email}</span>. You'll see status
            updates in your dashboard.
          </p>
        </Reveal>
      </form>

      {/* Provisional FAQ placement — relocate per editorial review */}
      <div className="mt-16 border-t border-border pt-12">
        <Reveal>
          <h2 className="mb-6 text-2xl font-bold text-text-main">Frequently asked questions</h2>
        </Reveal>
        <FAQAccordion items={DATASET_FAQS} />
      </div>
    </div>
  );
}

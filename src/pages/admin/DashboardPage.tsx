import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, CheckCircle, Clock, FileEdit, Inbox, MessageSquare, Landmark } from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import JobTable from '../../components/admin/JobTable';
import Button from '../../components/ui/Button';

export default function DashboardPage() {
  const { jobs, deleteJob, updateJob } = useJobs();
  const [filter, setFilter] = useState<'all' | 'open' | 'closed' | 'draft'>('all');

  const filtered = filter === 'all' ? jobs : jobs.filter((j) => j.status === filter);
  const counts = {
    total: jobs.length,
    open: jobs.filter((j) => j.status === 'open').length,
    draft: jobs.filter((j) => j.status === 'draft').length,
    closed: jobs.filter((j) => j.status === 'closed').length,
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'open' ? 'closed' : current === 'closed' ? 'draft' : 'open';
    await updateJob(id, { status: next as 'open' | 'closed' | 'draft' });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Dashboard</h1>
          <p className="mt-1 text-sm text-text-muted">Manage your job postings</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/contact" className="no-underline">
            <Button variant="secondary">
              <MessageSquare size={16} />
              Contact Inbox
            </Button>
          </Link>
          <Link to="/admin/reviews" className="no-underline">
            <Button variant="secondary">
              <Inbox size={16} />
              Dataset Reviews
            </Button>
          </Link>
          <Link to="/admin/withdrawals" className="no-underline">
            <Button variant="secondary">
              <Landmark size={16} />
              Withdrawals
            </Button>
          </Link>
          <Link to="/admin/jobs/new" className="no-underline">
            <Button>
              <Plus size={18} />
              New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Jobs', value: counts.total, icon: Briefcase, color: 'text-primary' },
          { label: 'Open', value: counts.open, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Drafts', value: counts.draft, icon: FileEdit, color: 'text-yellow-400' },
          { label: 'Closed', value: counts.closed, icon: Clock, color: 'text-text-muted' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <s.icon size={20} className={s.color} />
              <div>
                <p className="text-2xl font-bold text-text-main">{s.value}</p>
                <p className="text-xs text-text-muted">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-4 bg-surface rounded-lg p-1 w-fit">
        {(['all', 'open', 'draft', 'closed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              filter === f ? 'bg-surface-lighter text-text-main shadow-sm' : 'text-text-muted hover:text-text-main'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span className="ml-1.5 text-xs text-text-muted">{counts[f]}</span>
            )}
          </button>
        ))}
      </div>

      <JobTable jobs={filtered} onDelete={deleteJob} onToggleStatus={toggleStatus} />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Landmark, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';
import {
  listWithdrawalRequests,
  settleWithdrawal,
  PAYOUT_METHOD_LABELS,
  type AdminWithdrawalRequest,
} from '../../services/payoutService';
import Button from '../../components/ui/Button';

const STATUS_STYLES: Record<AdminWithdrawalRequest['status'], string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const money = (n: number) =>
  `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AdminWithdrawalsPage() {
  const [requests, setRequests] = useState<AdminWithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | AdminWithdrawalRequest['status']>('all');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [settlingId, setSettlingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setRequests(await listWithdrawalRequests());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load withdrawal requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const settle = async (req: AdminWithdrawalRequest, action: 'completed' | 'rejected', notes?: string) => {
    setSettlingId(req.id);
    setError('');
    try {
      await settleWithdrawal(req.id, action, notes);
      setRejectingId(null);
      setRejectNotes('');
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not settle the request');
    } finally {
      setSettlingId(null);
    }
  };

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);
  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending' || r.status === 'processing').length,
    completed: requests.filter((r) => r.status === 'completed').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-text-main">
            <Landmark size={22} className="text-primary" /> Withdrawals
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Settle MoneyGram / Western Union payout requests. Rejecting returns the amount to the member's wallet.
          </p>
        </div>
        <Button variant="secondary" onClick={load} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
      )}

      {/* Filter tabs */}
      <div className="mb-4 flex w-fit gap-1 rounded-lg bg-surface p-1">
        {(['all', 'pending', 'completed', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              filter === f ? 'bg-surface-lighter text-text-main shadow-sm' : 'text-text-muted hover:text-text-main'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 text-xs text-text-muted">{counts[f]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-16 text-center text-text-muted">Loading withdrawal requests…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-text-muted">
          No withdrawal requests {filter === 'all' ? 'yet' : `with status “${filter}”`}.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-xs uppercase tracking-wider text-text-muted">
                <th scope="col" className="px-5 py-3 font-semibold">Member</th>
                <th scope="col" className="px-5 py-3 font-semibold">Amount</th>
                <th scope="col" className="px-5 py-3 font-semibold">Payout</th>
                <th scope="col" className="px-5 py-3 font-semibold">Requested</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-bg">
              {filtered.map((r) => (
                <tr key={r.id} className="align-top">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-text-main">{r.users?.name || r.users?.username || 'Member'}</p>
                    <p className="text-xs text-text-muted">{r.users?.email}</p>
                  </td>
                  <td className="px-5 py-4 font-bold text-text-main">{money(Number(r.amount))}</td>
                  <td className="px-5 py-4">
                    <p className="text-text-main">{PAYOUT_METHOD_LABELS[r.payout_method] ?? r.payout_method}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-text-muted">
                      {r.payout_details?.name}
                      {r.payout_details?.phone ? ` · ${r.payout_details.phone}` : ''}
                      {r.payout_details?.address ? <><br />{r.payout_details.address}</> : ''}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-text-muted">
                    {new Date(r.submitted_at).toLocaleDateString()}
                    {r.processed_at && (
                      <p className="mt-0.5 text-xs">
                        <Clock size={11} className="mr-1 inline" />
                        settled {new Date(r.processed_at).toLocaleDateString()}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status]}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                    {r.admin_notes && <p className="mt-1 max-w-[180px] text-xs italic text-text-muted">“{r.admin_notes}”</p>}
                  </td>
                  <td className="px-5 py-4">
                    {r.status === 'pending' || r.status === 'processing' ? (
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => settle(r, 'completed')}
                            disabled={settlingId === r.id}
                          >
                            <CheckCircle2 size={14} /> Mark paid
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setRejectingId(rejectingId === r.id ? null : r.id);
                              setRejectNotes('');
                            }}
                            disabled={settlingId === r.id}
                          >
                            <XCircle size={14} /> Reject
                          </Button>
                        </div>
                        {rejectingId === r.id && (
                          <div className="w-64 rounded-lg border border-border bg-surface p-3 text-left">
                            <label className="mb-1 block text-xs font-semibold text-text-main">
                              Reason (credited back to the member's wallet)
                            </label>
                            <textarea
                              value={rejectNotes}
                              onChange={(e) => setRejectNotes(e.target.value)}
                              rows={2}
                              placeholder="e.g. Payout details could not be verified"
                              className="w-full rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs text-text-main outline-none focus:border-primary/60"
                            />
                            <div className="mt-2 flex justify-end gap-2">
                              <button
                                onClick={() => setRejectingId(null)}
                                className="cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium text-text-muted hover:text-text-main"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => settle(r, 'rejected', rejectNotes.trim() || undefined)}
                                disabled={settlingId === r.id}
                                className="cursor-pointer rounded-md bg-red-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                              >
                                {settlingId === r.id ? 'Rejecting…' : 'Confirm reject'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

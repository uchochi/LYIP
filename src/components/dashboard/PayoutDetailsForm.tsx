import { useEffect, useState } from 'react';
import { Loader2, Landmark, CheckCircle2 } from 'lucide-react';
import {
  validatePayoutDetails,
  savePayoutDetails,
  PAYOUT_METHOD_LABELS,
  type PayoutMethod,
  type PayoutDetails,
} from '../../services/payoutService';

/**
 * PayoutDetailsForm — collects the recipient details required to send money
 * via MoneyGram / Western Union: full name, phone number and address.
 * Used on the post-submission withdrawal setup and inside the withdraw modal.
 */
export default function PayoutDetailsForm({
  initialMethod,
  initialDetails,
  onSaved,
  compact,
  submitLabel = 'Save payout details',
}: {
  initialMethod?: PayoutMethod | null;
  initialDetails?: Partial<PayoutDetails> | null;
  onSaved?: (method: PayoutMethod, details: PayoutDetails) => void;
  compact?: boolean;
  submitLabel?: string;
}) {
  const [method, setMethod] = useState<PayoutMethod>(initialMethod ?? 'western_union');
  const [name, setName] = useState(initialDetails?.name ?? '');
  const [phone, setPhone] = useState(initialDetails?.phone ?? '');
  const [address, setAddress] = useState(initialDetails?.address ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialMethod) setMethod(initialMethod);
  }, [initialMethod]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const details: PayoutDetails = { name: name.trim(), phone: phone.trim(), address: address.trim() };
    const invalid = validatePayoutDetails(details);
    if (invalid) return setError(invalid);

    setSaving(true);
    try {
      await savePayoutDetails(method, details);
      setSaved(true);
      onSaved?.(method, details);
    } catch (err: any) {
      setError(err?.message || 'Could not save your payout details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-main outline-none transition-colors placeholder:text-zinc-600 focus:border-primary/60 focus:ring-2 focus:ring-primary/20';

  if (saved) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-400" />
        <div className="text-sm">
          <p className="font-semibold text-emerald-400">Payout details saved</p>
          <p className="mt-1 text-text-muted">
            Withdrawals to <span className="font-medium text-text-main">{PAYOUT_METHOD_LABELS[method]}</span> will be sent
            to <span className="font-medium text-text-main">{name.trim()}</span> at the address you provided.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!compact && (
        <p className="text-sm text-text-muted">
          We send payouts via <span className="font-medium text-text-main">MoneyGram</span> or{' '}
          <span className="font-medium text-text-main">Western Union</span>. Enter the recipient details exactly as they
          appear on a valid ID — this is what these services use to release the money.
        </p>
      )}

      {/* Method */}
      <div className="grid grid-cols-2 gap-2.5">
        {(['western_union', 'moneygram'] as PayoutMethod[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMethod(m)}
            className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
              method === m
                ? 'border-primary/60 bg-primary/10 ring-1 ring-primary/30'
                : 'border-border bg-surface hover:border-border-strong'
            }`}
          >
            <Landmark size={16} className={method === m ? 'text-primary' : 'text-text-muted'} />
            <span className="text-sm font-semibold text-text-main">{PAYOUT_METHOD_LABELS[m]}</span>
          </button>
        ))}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-text-main">Full name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Amara Okafor" className={inputCls} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-text-main">Phone number *</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+234 801 234 5678"
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-text-main">Address *</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          placeholder="Street, city, state/province, country"
          className={`${inputCls} resize-y`}
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Saving…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}

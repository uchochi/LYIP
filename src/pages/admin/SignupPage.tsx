import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { applyReferralCode } from '../../services/referralService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [signingUp, setSigningUp] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = (searchParams.get('ref') || '').trim();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim() || !name.trim()) {
      setError('All fields are required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSigningUp(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setSigningUp(false);
      return;
    }

    let referrerName: string | null = null;
    if (data.user) {
      // The public.users row must exist BEFORE applying a referral code
      // (referral_records has an FK to it), so upsert first.
      const { error: insertError } = await supabase.from('users').upsert(
        {
          id: data.user.id,
          email: data.user.email,
          name: name,
          role: 'apprentice',
        },
        { onConflict: 'id', ignoreDuplicates: true },
      );
      if (insertError) {
        console.error('Failed to create user profile:', insertError);
      } else if (referralCode) {
        try {
          referrerName = await applyReferralCode(referralCode);
        } catch (err) {
          // Never block signup on a referral problem — just skip attribution.
          console.warn('Referral code could not be applied:', err);
        }
      }
    }
    setSigningUp(false);

    // mailer_autoconfirm is enabled so the user gets a session immediately.
    // We route them to the forum with a reminder to verify their email later.
    navigate(referrerName ? `/forum?welcome=1&referred=${encodeURIComponent(referrerName)}` : '/forum?welcome=1');
  };

  return (
    <div className="mx-auto max-w-sm px-6 py-20">
      <h1 className="text-2xl font-bold text-text-main text-center">Create Account</h1>
      <p className="mt-2 text-sm text-text-muted text-center">Sign up to participate in the forum</p>

      {referralCode ? (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-primary/30 bg-primary/10 p-3.5 text-sm text-text-muted">
          <Gift size={17} className="mt-0.5 shrink-0 text-primary" />
          <p>
            You were invited with code <span className="font-mono font-semibold text-primary">{referralCode}</span>.
            Your invitee earns a reward when you submit your first dataset — welcome aboard!
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <Button type="submit" className="w-full" disabled={signingUp}>
          {signingUp ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createContactMessage } from '../services/contactService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Dataset Submission Help',
  'Account & Payment',
  'Technical Support',
  'Report an Issue',
  'Feature Request',
  'Partnership Inquiry',
  'Other',
];

export default function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isCustomSubject = subject === 'Other';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) return setError('Please enter your name');
    if (!email.trim()) return setError('Please enter your email');
    if (!subject) return setError('Please select a subject');
    if (isCustomSubject && !customSubject.trim()) return setError('Please enter your subject');
    if (!message.trim()) return setError('Please enter your message');

    setLoading(true);

    try {
      const finalSubject = isCustomSubject ? customSubject : subject;
      await createContactMessage({
        user_id: user?.id || null,
        name: name.trim(),
        email: email.trim(),
        subject: finalSubject.trim(),
        message: message.trim(),
      });

      setSuccess(true);
      // Reset form
      setName(user?.name || '');
      setEmail(user?.email || '');
      setSubject('');
      setCustomSubject('');
      setMessage('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-400">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-bold text-text-main">Message Sent!</h1>
          <p className="mt-4 text-text-muted">
            We've received your message and will get back to you within 1-2 business days.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/">
              <Button variant="secondary">Back to Home</Button>
            </Link>
            <Link to="/contact">
              <Button>Send Another Message</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MessageSquare size={32} />
        </div>
        <h1 className="text-3xl font-bold text-text-main sm:text-4xl">Contact Us</h1>
        <p className="mt-3 text-text-muted">
          Have questions? We're here to help. Fill out the form below and we'll respond within
          1-2 business days.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-text-main">
              Your Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-main">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-text-main">
              Subject
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-border bg-surface-lighter px-4 py-2.5 text-text-main placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a subject...</option>
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Subject */}
          {isCustomSubject && (
            <div>
              <label htmlFor="customSubject" className="mb-2 block text-sm font-medium text-text-main">
                Your Subject
              </label>
              <Input
                id="customSubject"
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Enter your subject"
                disabled={loading}
              />
            </div>
          )}

          {/* Message */}
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-text-main">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more about your question or issue..."
              rows={6}
              disabled={loading}
              className="w-full rounded-lg border border-border bg-surface-lighter px-4 py-2.5 text-text-main placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Alternative Contact */}
      <div className="mt-8 text-center">
        <p className="text-sm text-text-muted">
          Already checked the <Link to="/faq" className="text-primary underline">FAQ</Link> and{' '}
          <Link to="/start" className="text-primary underline">tutorial</Link>? If you need immediate
          help, join our{' '}
          <a
            href="https://discord.gg/loseyourip"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Discord community
          </a>
        </p>
      </div>
    </div>
  );
}
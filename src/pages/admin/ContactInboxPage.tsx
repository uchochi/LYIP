import { useState, useEffect } from 'react';
import {
  Inbox,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Send,
  User,
  Search,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchContactMessages, respondToContactMessage, updateContactMessageStatus, type ContactMessage } from '../../services/contactService';
import Button from '../../components/ui/Button';
import ProtectedAdminRoute from '../../components/admin/ProtectedAdminRoute';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/20',
  },
  responded: {
    label: 'Responded',
    icon: MessageSquare,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
  },
  resolved: {
    label: 'Resolved',
    icon: CheckCircle2,
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/20',
  },
  closed: {
    label: 'Closed',
    icon: XCircle,
    color: 'text-text-muted',
    bg: 'bg-surface border-border',
  },
} as const;

function ContactInboxPage() {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded' | 'resolved' | 'closed'>('all');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [responseText, setResponseText] = useState('');
  const [responding, setResponding] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchContactMessages();
      setMessages(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const filteredMessages = messages.filter((m) => {
    const matchesFilter = filter === 'all' || m.status === filter;
    const matchesSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: messages.length,
    pending: messages.filter((m) => m.status === 'pending').length,
    responded: messages.filter((m) => m.status === 'responded').length,
    resolved: messages.filter((m) => m.status === 'resolved').length,
    closed: messages.filter((m) => m.status === 'closed').length,
  };

  const handleSendMessage = async () => {
    if (!selectedMessage || !responseText.trim()) return;

    setResponding(true);
    setError('');
    try {
      await respondToContactMessage(
        selectedMessage.id,
        responseText.trim(),
        'responded'
      );
      await loadMessages();
      setResponseText('');
      setSelectedMessage(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send response');
    } finally {
      setResponding(false);
    }
  };

  const handleUpdateStatus = async (status: ContactMessage['status']) => {
    if (!selectedMessage) return;

    setUpdating(true);
    setError('');
    try {
      await updateContactMessageStatus(selectedMessage.id, status);
      await loadMessages();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <ProtectedAdminRoute>
        <></>
      </ProtectedAdminRoute>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Contact Inbox</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage and respond to user-submitted contact messages
          </p>
        </div>
        <Button variant="secondary" onClick={loadMessages} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(counts).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={`rounded-xl border p-4 text-left transition-all ${
              filter === key
                ? 'border-primary bg-primary/10 shadow-sm'
                : 'border-border bg-surface hover:border-border/60'
            }`}
          >
            <p className="text-2xl font-bold text-text-main">{value}</p>
            <p className="text-xs text-text-muted capitalize">{key}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, subject, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-lighter pl-12 pr-4 py-2.5 text-text-main placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <Inbox size={48} className="mx-auto mb-4 text-text-muted" />
              <p className="text-text-muted">No messages found</p>
            </div>
          ) : (
            filteredMessages.map((message) => {
              const config = STATUS_CONFIG[message.status];
              return (
                <button
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    selectedMessage?.id === message.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-surface hover:border-border/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User size={14} className="text-text-muted shrink-0" />
                        <p className="font-medium text-text-main truncate">{message.name}</p>
                        <span className="text-xs text-text-muted shrink-0">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted truncate mb-2">{message.subject}</p>
                      <div className="flex items-center gap-2">
                        <MessageSquare size={12} className="text-text-muted shrink-0" />
                        <p className="text-xs text-text-muted truncate">{message.email}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${config.bg} ${config.color}`}>
                      <config.icon size={12} />
                      {config.label}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-1">
          {selectedMessage ? (
            <div className="sticky top-6 space-y-4">
              {/* Selected Message Card */}
              <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-text-main">{selectedMessage.name}</h3>
                    <p className="text-sm text-text-muted">{selectedMessage.email}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${STATUS_CONFIG[selectedMessage.status].bg} ${STATUS_CONFIG[selectedMessage.status].color}`}>
                    {(() => {
                      const StatusIcon = STATUS_CONFIG[selectedMessage.status].icon;
                      return <StatusIcon size={12} />;
                    })()}
                    {STATUS_CONFIG[selectedMessage.status].label}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-text-muted mb-1">SUBJECT</p>
                  <p className="text-sm text-text-main">{selectedMessage.subject}</p>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-text-muted mb-1">MESSAGE</p>
                  <p className="text-sm text-text-main whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="text-xs text-text-muted">
                  Sent: {new Date(selectedMessage.created_at).toLocaleString()}
                  {selectedMessage.responded_at && (
                    <span> · Responded: {new Date(selectedMessage.responded_at).toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Existing Response */}
              {selectedMessage.admin_response && (
                <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                  <p className="text-xs font-semibold text-text-muted mb-2">ADMIN RESPONSE</p>
                  <p className="text-sm text-text-main whitespace-pre-wrap">{selectedMessage.admin_response}</p>
                </div>
              )}

              {/* Response Form */}
              <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                <p className="text-xs font-semibold text-text-muted mb-3">YOUR RESPONSE</p>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                  rows={4}
                  className="w-full rounded-lg border border-border bg-surface-lighter px-3 py-2 text-sm text-text-main placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y mb-3"
                  disabled={responding}
                />
                <Button onClick={handleSendMessage} disabled={responding || !responseText.trim()} className="w-full">
                  {responding ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Send Response
                    </>
                  )}
                </Button>
              </div>

              {/* Status Actions */}
              <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                <p className="text-xs font-semibold text-text-muted mb-3">UPDATE STATUS</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(STATUS_CONFIG)
                    .filter(([key]) => key !== selectedMessage.status)
                    .map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => handleUpdateStatus(key as ContactMessage['status'])}
                        disabled={updating}
                        className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                          selectedMessage.status === key
                            ? `${config.bg} ${config.color} border-transparent`
                            : 'border-border bg-surface-lighter text-text-muted hover:border-border/60'
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <config.icon size={12} />
                        {config.label}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="sticky top-6 rounded-xl border border-border bg-surface p-8 text-center shadow-sm">
              <MessageSquare size={48} className="mx-auto mb-4 text-text-muted" />
              <p className="text-text-muted">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactInboxPage;
import { useState, useRef, useEffect, type FormEvent } from 'react';
import TypingIndicator from './TypingIndicator';
import MarkdownToolbar from './MarkdownToolbar';

interface ChatInputProps {
  placeholder?: string;
  buttonText?: string;
  typingUsers: string[];
  replyingTo?: string | null;
  onCancelReply?: () => void;
  onSend: (content: string, stickerUrl?: string | null) => void;
  onTyping?: () => void;
  onStoppedTyping?: () => void;
  disabled?: boolean;
}

const EMOJIS = ['😀', '😂', '😍', '🤔', '😭', '😎', '🙏', '👀', '✅', '🚀', '🔥', '💎', '❤️', '🎉', '💯', '😴', '🤝', '👏', '💡', '📦', '✨', '🌪️', '⚡', '💪'];
const STICKERS = [
  'https://cdn-icons-png.flaticon.com/512/6154/6154705.png',
  'https://cdn-icons-png.flaticon.com/512/742/742751.png',
  'https://cdn-icons-png.flaticon.com/512/1791/1791330.png',
  'https://cdn-icons-png.flaticon.com/512/2107/2107957.png',
  'https://cdn-icons-png.flaticon.com/512/3524/3524659.png',
  'https://cdn-icons-png.flaticon.com/512/4391/4391605.png',
  'https://cdn-icons-png.flaticon.com/512/1903/1903162.png',
  'https://cdn-icons-png.flaticon.com/512/1791/1791455.png',
];

export default function ChatInput({
  placeholder = 'Drop your hot take, dataset, or wisdom...',
  buttonText = 'Drop It 🚀',
  typingUsers,
  replyingTo,
  onCancelReply,
  onSend,
  onTyping,
  onStoppedTyping,
  disabled = false,
}: ChatInputProps) {
  const [content, setContent] = useState('');
  const [pendingSticker, setPendingSticker] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSticker, setShowSticker] = useState(false);
  const [showFormat, setShowFormat] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [content]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
        setShowSticker(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed && !pendingSticker) return;
    onSend(trimmed || '📦', pendingSticker);
    onStoppedTyping?.();
    setContent('');
    setPendingSticker(null);
  };

  const addEmoji = (emoji: string) => {
    setContent((c) => c + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  const addSticker = (url: string) => {
    setPendingSticker(url);
    setShowSticker(false);
  };

  return (
    <div className="input-container">
      <div className="input-box" ref={boxRef}>
        <span className="typing-indicator">⚡ <TypingIndicator users={typingUsers} /></span>
        {replyingTo && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Replying to a post{' '}
            {onCancelReply && (
              <button type="button" onClick={onCancelReply} style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', fontSize: '11px' }}>
                Cancel
              </button>
            )}
          </div>
        )}
        {pendingSticker && (
          <div style={{ marginBottom: '8px', position: 'relative' }}>
            <img src={pendingSticker} className="sticker-img" alt="Sticker preview" style={{ height: '48px', margin: 0 }} />
            <button
              type="button"
              onClick={() => setPendingSticker(null)}
              style={{ position: 'absolute', top: '-6px', left: '42px', background: 'var(--surface-lighter)', border: '1px solid var(--border)', borderRadius: '50%', width: '18px', height: '18px', color: 'white', cursor: 'pointer', fontSize: '11px', lineHeight: 1 }}
              title="Remove sticker"
            >
              ×
            </button>
          </div>
        )}
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={placeholder}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (e.target.value.trim()) onTyping?.();
            else onStoppedTyping?.();
          }}
          onBlur={() => {
            if (!content.trim()) onStoppedTyping?.();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        {showFormat && (
          <div style={{ marginTop: '8px' }}>
            <MarkdownToolbar textareaRef={textareaRef} value={content} onChange={setContent} compact />
          </div>
        )}
        <div className="input-actions">
          <div className="tools">
            <span onClick={() => setShowEmoji(!showEmoji)} title="Add emoji">😊</span>
            <span onClick={() => setShowSticker(!showSticker)} title="Add sticker">📎</span>
            <span
              onClick={() => setShowFormat((s) => !s)}
              title="Markdown formatting"
              style={{ color: showFormat ? 'var(--accent-primary)' : undefined }}
            >
              Md
            </span>
            <span title="Coming soon">✨</span>
          </div>
          <button type="submit" className="btn-send" disabled={disabled || (!content.trim() && !pendingSticker)} onClick={handleSubmit}>
            {buttonText}
          </button>
        </div>
        {showEmoji && (
          <div className="emoji-picker">
            {EMOJIS.map((e) => (
              <button key={e} type="button" onClick={() => addEmoji(e)}>
                {e}
              </button>
            ))}
          </div>
        )}
        {showSticker && (
          <div className="sticker-picker">
            {STICKERS.map((s) => (
              <img key={s} src={s} alt="Sticker" onClick={() => addSticker(s)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
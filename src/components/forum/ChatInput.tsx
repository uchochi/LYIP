import { useState, useRef, useEffect, type FormEvent } from 'react';
import TypingIndicator from './TypingIndicator';

interface ChatInputProps {
  placeholder?: string;
  buttonText?: string;
  typingUsers: string[];
  replyingTo?: string | null;
  onCancelReply?: () => void;
  onSend: (content: string, stickerUrl?: string | null) => void;
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
  placeholder = 'Share a dataset or ask a question...',
  buttonText = 'Post Update',
  typingUsers,
  replyingTo,
  onCancelReply,
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [content, setContent] = useState('');
  const [pendingSticker, setPendingSticker] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSticker, setShowSticker] = useState(false);
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
    <div className="input-box" ref={boxRef}>
      <TypingIndicator users={typingUsers} />
      {replyingTo && (
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Replying to a post{' '}
          {onCancelReply && (
            <button type="button" onClick={onCancelReply} style={{ color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', fontSize: '11px' }}>
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
            style={{ position: 'absolute', top: '-6px', left: '42px', background: 'var(--border)', border: 'none', borderRadius: '50%', width: '18px', height: '18px', color: 'white', cursor: 'pointer', fontSize: '11px', lineHeight: 1 }}
            title="Remove sticker"
          >
            ×
          </button>
        </div>
      )}
      <textarea
        ref={textareaRef}
        rows={1}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <div className="input-actions">
        <div className="tools" style={{ position: 'relative' }}>
          <button className="tool-btn" type="button" onClick={() => { setShowEmoji((s) => !s); setShowSticker(false); }} title="Emoji">
            😊
          </button>
          <button className="tool-btn" type="button" onClick={() => { setShowSticker((s) => !s); setShowEmoji(false); }} title="Sticker">
            📎
          </button>
          <span style={{ fontSize: '18px', opacity: 0.5 }}>📊</span>
          <span style={{ fontSize: '18px', opacity: 0.5 }}>✨</span>
          {showEmoji && (
            <div className="emoji-picker">
              {EMOJIS.map((em) => (
                <button key={em} type="button" onClick={() => addEmoji(em)}>{em}</button>
              ))}
            </div>
          )}
          {showSticker && (
            <div className="sticker-picker">
              {STICKERS.map((url) => (
                <img key={url} src={url} alt="sticker" onClick={() => addSticker(url)} loading="lazy" />
              ))}
            </div>
          )}
        </div>
        <button className="btn-send" type="submit" onClick={handleSubmit} disabled={disabled || (!content.trim() && !pendingSticker)}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}

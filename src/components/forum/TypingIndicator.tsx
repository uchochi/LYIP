interface TypingIndicatorProps {
  users: string[];
}

export default function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null;
  let text: React.ReactNode;
  if (users.length === 1) {
    text = (<><b>{users[0]}</b> is typing...</>);
  } else if (users.length === 2) {
    text = (<><b>{users[0]}</b> and <b>{users[1]}</b> are typing...</>);
  } else {
    text = (<><b>{users[0]}</b> and <b>{users.length - 1} others</b> are typing...</>);
  }
  return (
    <span className="typing">⚡ {text}</span>
  );
}

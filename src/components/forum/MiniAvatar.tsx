import { initials } from '../../lib/handleFromName';

interface MiniAvatarProps {
  name: string;
  color?: string | null;
}

export default function MiniAvatar({ name, color = '#58a6ff' }: MiniAvatarProps) {
  return (
    <div className="mini-avatar" style={{ background: color || '#58a6ff' }}>
      {initials(name)}
    </div>
  );
}

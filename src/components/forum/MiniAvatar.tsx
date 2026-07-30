import { initials } from '../../lib/handleFromName';

interface MiniAvatarProps {
  name: string;
  color?: string | null;
}

export default function MiniAvatar({ name, color = '#3b82f6' }: MiniAvatarProps) {
  return (
    <div className="avatar" style={{ background: color || '#3b82f6' }}>
      {initials(name)}
    </div>
  );
}

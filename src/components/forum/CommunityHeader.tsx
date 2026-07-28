import { formatNumber } from '../../lib/relativeTime';

interface CommunityHeaderProps {
  title: string;
  memberCount: number;
  onlineCount: number;
}

export default function CommunityHeader({ title, memberCount, onlineCount }: CommunityHeaderProps) {
  return (
    <div className="stats-header">
      <div className="topic-info">
        <h2>{title}</h2>
      </div>
      <div className="community-stats">
        <div className="stat-item" style={{ color: 'var(--text-muted)' }}>
          <span>👥</span>
          <b>{formatNumber(memberCount)}</b>
          <span>MEMBERS</span>
        </div>
        <div className="stat-item">
          <div className="online-dot"></div>
          <span style={{ color: 'var(--live-red)' }}>{formatNumber(onlineCount)} ONLINE</span>
        </div>
      </div>
    </div>
  );
}

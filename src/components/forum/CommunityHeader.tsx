import { formatNumber } from '../../lib/relativeTime';

interface CommunityHeaderProps {
  title: string;
  memberCount: number;
  onlineCount: number;
}

export default function CommunityHeader({ title, memberCount, onlineCount }: CommunityHeaderProps) {
  return (
    <>
      {/* TIER 1: GLOBAL UTILITY (Floating Pill) */}
      <div className="global-stats-bar">
        <div className="stats-pill">
          <div className="stat-item">👥 {formatNumber(memberCount)} MEMBERS</div>
          <div className="stat-item online-indicator">
            <div className="online-dot"></div>
            <span>{formatNumber(onlineCount)} ONLINE</span>
          </div>
        </div>
      </div>

      {/* TIER 2: TOPIC HEADER (Sticky) */}
      <header className="topic-header">
        <h2>{title}</h2>
      </header>
    </>
  );
}

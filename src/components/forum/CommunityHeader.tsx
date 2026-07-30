import { formatNumber } from '../../lib/relativeTime';

interface CommunityStats {
  views?: number;
  reactions?: number;
  replies?: number;
}

interface CommunityHeaderProps {
  title: string;
  memberCount?: number;
  onlineCount?: number;
  topicStats?: CommunityStats;
  showCommunityStats?: boolean;
}

export default function CommunityHeader({
  title,
  memberCount = 0,
  onlineCount = 0,
  topicStats,
  showCommunityStats = true
}: CommunityHeaderProps) {
  return (
    <>
      {/* TIER 1: GLOBAL UTILITY (Floating Pill) - Only on forum home */}
      {showCommunityStats && memberCount > 0 && (
        <div className="global-stats-bar">
          <div className="stats-pill">
            <div className="stat-item">👥 {formatNumber(memberCount)} MEMBERS</div>
            <div className="stat-item online-indicator">
              <div className="online-dot"></div>
              <span>{formatNumber(onlineCount)} ONLINE</span>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC STATS - Only on topic pages */}
      {!showCommunityStats && topicStats && (
        <div className="topic-stats-bar">
          <div className="stats-pill">
            {topicStats.views !== undefined && (
              <div className="stat-item">
                <span>👁️</span>
                <b>{formatNumber(topicStats.views)}</b>
                <span>VIEWS</span>
              </div>
            )}
            {topicStats.reactions !== undefined && (
              <div className="stat-item">
                <span>❤️</span>
                <b>{formatNumber(topicStats.reactions)}</b>
                <span>REACTIONS</span>
              </div>
            )}
            {topicStats.replies !== undefined && (
              <div className="stat-item">
                <span>💬</span>
                <b>{formatNumber(topicStats.replies)}</b>
                <span>REPLIES</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TIER 2: TOPIC HEADER (Sticky) */}
      <header className="topic-header">
        <h2>{title}</h2>
      </header>
    </>
  );
}

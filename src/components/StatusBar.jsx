export default function StatusBar({ status, stats }) {
    return (
        <div className="status-bar">
            <div>
                <span className={`status-dot ${status}`} />
                <span>{status === 'ready' ? 'Ready' : status === 'loading' ? 'Loading relic data...' : 'Failed to load data — try refreshing'}</span>
            </div>
            <div className="status-stats">{stats}</div>
        </div>
    );
}

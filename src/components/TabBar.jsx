export default function TabBar({ activeTab, onChange }) {
    return (
        <div className="tab-bar">
            <button className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`} onClick={() => onChange('single')}>Single Check</button>
            <button className={`tab-btn ${activeTab === 'batch' ? 'active' : ''}`} onClick={() => onChange('batch')}>Batch Check</button>
            <button className={`tab-btn ${activeTab === 'ocr' ? 'active' : ''}`} onClick={() => onChange('ocr')}>Screenshot OCR</button>
        </div>
    );
}

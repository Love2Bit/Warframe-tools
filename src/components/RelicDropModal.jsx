import { MATERIAL_MAP } from '../services/materialAssets';
import commonIcon from '../assets/Relic Rarity/IconCommon.webp';
import uncommonIcon from '../assets/Relic Rarity/IconUncommon.webp';
import rareIcon from '../assets/Relic Rarity/IconRare.webp';
import ducatsIcon from '../assets/Relic Rarity/OrokinDucats.png';

const RARITY_ICONS = {
    Common: commonIcon,
    Uncommon: uncommonIcon,
    Rare: rareIcon,
};

export default function RelicDropModal({ isOpen, relicName, drops, loading, error, onClose }) {
    if (!isOpen) return null;

    const common = drops.filter(d => d.rarity === 'Common');
    const uncommon = drops.filter(d => d.rarity === 'Uncommon');
    const rare = drops.filter(d => d.rarity === 'Rare');

    const cells = [...common, ...uncommon, ...rare];
    while (cells.length < 6) cells.push(null);

    return (
        <div className={`modal-overlay ${isOpen ? 'show' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{relicName}</h2>
                    <span className="modal-close" onClick={onClose}>×</span>
                </div>
                <div className="modal-body">
                    {loading && <div className="modal-loading">Loading drop table...</div>}
                    {error && <div className="modal-error">Could not load drop table. <a href={`https://wiki.warframe.com/w/${encodeURIComponent(relicName.replace(/\s+/g, '_'))}`} target="_blank" rel="noreferrer" style={{ color: '#f5a623' }}>View on Wiki →</a></div>}
                    {!loading && !error && (
                        <div className="drop-grid">
                            {cells.map((drop, idx) => {
                                if (!drop) return <div key={`empty-${idx}`} className="drop-cell empty" />;
                                const rarityClass = `rarity-${drop.rarity.toLowerCase()}`;
                                const fullImg = drop.img?.startsWith('http') ? drop.img : `https://wiki.warframe.com${drop.img}`;
                                const materialSrc = drop.materialKey ? MATERIAL_MAP[drop.materialKey] : null;
                                return (
                                    <div key={`${drop.name}-${idx}`} className="drop-cell">
                                        {materialSrc ? (
                                            <>
                                                <img className="item-thumbnail" src={fullImg} alt={drop.name} loading="lazy" />
                                                <img className="material-image" src={materialSrc} alt={`${drop.name} material`} loading="lazy" />
                                            </>
                                        ) : (
                                            <img className="material-image" src={fullImg} alt={drop.name} loading="lazy" />
                                        )}
                                        <div className="item-name">{drop.name}</div>
                                        {RARITY_ICONS[drop.rarity] && <img className="item-rarity-icon" src={RARITY_ICONS[drop.rarity]} alt={drop.rarity} />}
                                        {drop.ducats > 0 && <div className="item-ducats"><img className="ducats-icon" src={ducatsIcon} alt="Ducats" /> {drop.ducats}</div>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import varziaIcon from '../assets/varzia.webp';
import baroIcon from '../assets/Baro.webp';

export default function AutocompleteDropdown({ matches, show, highlightedIdx, vaultedSet, resurgenceSet, baroSet, onSelect }) {
    if (!show || matches.length === 0) return null;
    return (
        <div className="autocomplete-list show">
            {matches.map((name, idx) => {
                const vaulted = vaultedSet.has(name);
                const varzia = resurgenceSet?.has(name);
                const baro = baroSet?.has(name);
                return (
                    <div key={name} className="autocomplete-item" style={{ background: idx === highlightedIdx ? '#252540' : '' }} onMouseDown={() => onSelect(name)}>
                        <span>{name}</span>
                        <span className="badge-badges">
                            {baro && <span className="badge baro"><img src={baroIcon} alt="" className="badge-icon" />Baro</span>}
                            {varzia && <span className="badge varzia"><img src={varziaIcon} alt="" className="badge-icon" />Varzia</span>}
                            <span className={`badge ${vaulted ? 'vaulted' : 'active'}`}>{vaulted ? 'Vaulted' : 'Active'}</span>
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

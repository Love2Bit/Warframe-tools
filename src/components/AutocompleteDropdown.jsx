export default function AutocompleteDropdown({ matches, show, highlightedIdx, vaultedSet, onSelect }) {
    if (!show || matches.length === 0) return null;
    return (
        <div className="autocomplete-list show">
            {matches.map((name, idx) => {
                const vaulted = vaultedSet.has(name);
                return (
                    <div key={name} className="autocomplete-item" style={{ background: idx === highlightedIdx ? '#252540' : '' }} onMouseDown={() => onSelect(name)}>
                        <span>{name}</span>
                        <span className={`badge ${vaulted ? 'vaulted' : 'active'}`}>{vaulted ? 'Vaulted' : 'Active'}</span>
                    </div>
                );
            })}
        </div>
    );
}

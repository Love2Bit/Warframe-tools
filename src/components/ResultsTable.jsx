export default function ResultsTable({ rows, openModal }) {
    return (
        <div className="batch-results">
            <table>
                <thead><tr><th>Relic</th><th>Status</th></tr></thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={`${row.display}-${idx}`}>
                            <td><span className="clickable-relic" onClick={() => row.match && openModal(row.match)}>{row.display}</span></td>
                            <td><span className={`batch-badge ${row.status}`}>{row.statusText}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

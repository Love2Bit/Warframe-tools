import varziaIcon from '../assets/varzia.webp';
import baroIcon from '../assets/Baro.webp';

export default function ResultsTable({ rows, openModal, resurgenceSet, baroSet }) {
    return (
        <div className="batch-results">
            <table>
                <thead><tr><th>Relic</th><th>Status</th></tr></thead>
                <tbody>
                    {rows.map((row, idx) => {
                        const varzia = resurgenceSet?.has(row.match);
                        const baro = baroSet?.has(row.match);
                        return (
                            <tr key={`${row.display}-${idx}`}>
                                <td>
                                    <span className="clickable-relic" onClick={() => row.match && openModal(row.match)}>{row.display}</span>
                                    {baro && <span className="baro-result compact"><img src={baroIcon} alt="" /> Baro</span>}
                                    {varzia && <span className="varzia-result compact"><img src={varziaIcon} alt="" /> Varzia</span>}
                                </td>
                                <td><span className={`batch-badge ${row.status}`}>{row.statusText}</span></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

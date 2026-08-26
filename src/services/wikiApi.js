const WIKI_API = 'https://wiki.warframe.com/api.php';

export async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export async function fetchAllCategory(category, type = '') {
    const members = [];
    let continueToken = null;

    do {
        const params = new URLSearchParams({
            action: 'query',
            list: 'categorymembers',
            cmtitle: category,
            cmlimit: '500',
            format: 'json',
            origin: '*'
        });
        if (type) params.set('cmtype', type);
        if (continueToken) params.set('cmcontinue', continueToken);

        const data = await fetchJSON(`${WIKI_API}?${params}`);
        members.push(...(data?.query?.categorymembers || []));
        continueToken = data?.continue?.cmcontinue || null;
    } while (continueToken);

    return members;
}

// Item image cache (module-level Map persists across renders)
const imageCache = new Map();
const relicStatusCache = new Map();

export async function fetchRelicStatus(relicName) {
    if (relicStatusCache.has(relicName)) return relicStatusCache.get(relicName);

    const page = relicName.replace(/\s+/g, '_');
    const res = await fetch(`${WIKI_API}?action=parse&page=${encodeURIComponent(page)}&prop=text&format=json&origin=*`);
    if (!res.ok) throw new Error(`Wiki API returned ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error.info || 'Wiki API error');

    const html = data?.parse?.text?.['*'] || '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const statusRow = doc.querySelector('.infobox > .row > .value.caption');
    const statusText = statusRow?.textContent.trim() || '';
    const varziaAvailable = /prime resurgence available/i.test(statusText);
    const result = { name: relicName, vaulted: /vaulted/i.test(statusText), varziaAvailable };
    relicStatusCache.set(relicName, result);
    return result;
}

export async function fetchItemImages(drops) {
    const uniquePages = [...new Set(drops.map(d => d.pagePath).filter(Boolean))];
    const uncached = uniquePages.filter(p => !imageCache.has(p));
    if (uncached.length === 0) {
        return drops.map(d => ({
            ...d,
            img: d.pagePath && imageCache.has(d.pagePath) ? imageCache.get(d.pagePath) : d.img
        }));
    }

    const titles = uncached.join('|');
    try {
        const res = await fetch(`${WIKI_API}?action=query&titles=${encodeURIComponent(titles)}&redirects=1&prop=pageimages&pithumbsize=300&format=json`);
        const data = await res.json();
        const pages = data?.query?.pages || {};

        const redirectMap = {};
        for (const r of (data?.query?.redirects || [])) {
            redirectMap[r.to] = r.from;
        }

        for (const page of Object.values(pages)) {
            const thumb = page?.thumbnail?.source;
            const originalTitle = redirectMap[page.title] || page.title;
            const matchedPath = uncached.find(p => p === originalTitle || p.replace(/_/g, ' ') === originalTitle);
            if (matchedPath) {
                imageCache.set(matchedPath, thumb || null);
            }
        }
    } catch {
        for (const p of uncached) imageCache.set(p, null);
    }

    for (const p of uncached) {
        if (!imageCache.has(p)) imageCache.set(p, null);
    }

    return drops.map(d => ({
        ...d,
        img: d.pagePath && imageCache.has(d.pagePath) && imageCache.get(d.pagePath)
            ? imageCache.get(d.pagePath)
            : d.img
    }));
}

export function parseDropTable(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const table = doc.querySelector('table.wikitable');
    if (!table) return [];

    const drops = [];
    const rows = table.querySelectorAll('tr');
    let currentRarity = '';

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td');
        if (cells.length < 2) continue;

        const itemCell = cells[0];
        const img = itemCell.querySelector('img');
        const link = [...itemCell.querySelectorAll('a')]
            .find(a => a.textContent.trim() && !a.getAttribute('href')?.startsWith('/w/File:'));
        const pagePath = link ? (link.getAttribute('href') || '').replace(/^\/w\//, '') : '';
        const imgSrc = img ? (img.getAttribute('src') || img.getAttribute('data-src') || '') : '';
        const itemName = link ? link.textContent.trim() : '';

        const ducatText = cells[1] ? cells[1].textContent.trim() : '';
        const ducats = parseInt(ducatText) || 0;

        if (cells.length >= 3) {
            const rarityCell = cells[2];
            const rarityText = rarityCell.textContent.trim();
            const rm = rarityText.match(/(Common|Uncommon|Rare)/i);
            if (rm) currentRarity = rm[1];
        }

        if (itemName && currentRarity) {
            drops.push({ name: itemName, img: imgSrc, ducats, rarity: currentRarity, pagePath });
        }
    }
    return drops;
}

export async function fetchRelicDropTable(relicName) {
    const res = await fetch(`${WIKI_API}?action=parse&page=${encodeURIComponent(relicName.replace(/\s+/g, '_'))}&prop=text&format=json&origin=*`);
    if (!res.ok) throw new Error(`Wiki API returned ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error.info || 'Wiki API error');
    const html = data?.parse?.text?.['*'];
    if (!html) throw new Error('No page HTML returned');
    const drops = parseDropTable(html);
    if (drops.length === 0) throw new Error('Drop table not found');
    return drops;
}

export { WIKI_API };

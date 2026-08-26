import { getRelicData } from './warframeItems';

const CDN_BASE = 'https://cdn.warframestat.us/img';

export function getImageUrl(item) {
    if (!item?.imageName) return null;
    return `${CDN_BASE}/${item.imageName}`;
}

export function getRewardImage(reward) {
    // The compact relic dataset stores uniqueName but not item imageName.
    // Use the original 38px wiki fallback until the full item index is loaded.
    return null;
}

export function formatRarity(rarity) {
    return rarity?.charAt(0).toUpperCase() + rarity?.slice(1).toLowerCase() || '';
}

export function formatDucats(item) {
    return item?.ducats ?? 0;
}

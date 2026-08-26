import barrel from '../assets/Materials/prime_barrel_128x128.webp';
import blade from '../assets/Materials/prime_blade_128x128.webp';
import chassis from '../assets/Materials/prime_chassis_128x128.webp';
import grip from '../assets/Materials/prime_grip_128x128.webp';
import guard from '../assets/Materials/prime_guard_128x128.webp';
import handle from '../assets/Materials/prime_handle_128x128.webp';
import helmet from '../assets/Materials/prime_helmet_128x128.webp';
import link from '../assets/Materials/prime_link_128x128.webp';
import stock from '../assets/Materials/prime_stock_128x128.webp';
import systems from '../assets/Materials/prime_systems_128x128.webp';

export const MATERIAL_MAP = {
    barrel,
    blade,
    chassis,
    grip,
    guard,
    handle,
    helmet,
    link,
    stock,
    systems,
};

const aliases = new Map([
    ['stock', 'stock'],
    ['string', 'stock'],
    ['chain', 'stock'],
    ['blades', 'blade'],
    ['blade', 'blade'],
    ['limb', 'blade'],
    ['disc', 'blade'],
    ['head', 'blade'],
    ['link', 'link'],
    ['pouch', 'link'],
    ['ornament', 'link'],
    ['handle', 'handle'],
    ['hilt', 'handle'],
    ['gauntlet', 'handle'],
    ['guard', 'guard'],
    ['boot', 'guard'],
    ['neuroptics', 'helmet'],
    ['cerebrum', 'helmet'],
    ['chassis', 'chassis'],
    ['carapace', 'chassis'],
    ['barrel', 'barrel'],
    ['receiver', 'barrel'],
    ['grip', 'grip'],
    ['systems', 'systems'],
]);

export function getMaterialKey(name) {
    const words = name?.toLowerCase().match(/[a-z]+/g) || [];
    return words.reduce((key, word) => key || aliases.get(word) || null, null);
}

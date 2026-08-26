import fs from 'node:fs';
import path from 'node:path';
import Items from '@wfcd/items';

const items = new Items({ category: ['Relics'] });
const relics = items
    .filter(item => item.name.endsWith(' Intact'))
    .map(item => ({
        name: item.name.replace(/ Intact$/, ''),
        vaulted: Boolean(item.vaulted),
        rewards: (item.rewards || []).map(reward => ({
            name: reward.item.name,
            rarity: reward.rarity,
            chance: reward.chance,
            uniqueName: reward.item.uniqueName,
            imageName: reward.item.imageName || null,
        })),
    }));

const output = path.resolve('src/data/relics.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(relics));
console.log(`Generated ${relics.length} relic records at ${output}`);

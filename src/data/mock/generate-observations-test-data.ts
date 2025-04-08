import { faker } from '@faker-js/faker';
import { ExperResultData } from '../../types/ExpertTableData.type';

const categories = ['Plants', 'Birds', 'Mammals', 'Insects', 'Fungi'];
const commonNames = {
    Plants: ['Oak', 'Maple', 'Fern', 'Cactus', 'Bamboo'],
    Birds: ['Robin', 'Eagle', 'Sparrow', 'Owl', 'Pelican'],
    Mammals: ['Deer', 'Fox', 'Bear', 'Wolf', 'Squirrel'],
    Insects: ['Butterfly', 'Ant', 'Bee', 'Dragonfly', 'Beetle'],
    Fungi: ['Red-banded Polypore', 'Shaggy Mane', 'Fly Agaric', 'Morel', 'Oyster Mushroom']
};
const subNames = {
    Plants: [
        'Quercus alba',         // Oak
        'Acer saccharum',       // Maple
        'Pteridium aquilinum',  // Fern
        'Carnegiea gigantea',   // Cactus
        'Phyllostachys edulis'  // Bamboo
    ],
    Birds: [
        'Erithacus rubecula',   // Robin
        'Aquila chrysaetos',    // Eagle
        'Passer domesticus',    // Sparrow
        'Strix aluco',          // Owl
        'Pelecanus occidentalis'// Pelican
    ],
    Mammals: [
        'Odocoileus virginianus', // Deer
        'Vulpes vulpes',          // Fox
        'Ursus arctos',           // Bear
        'Canis lupus',            // Wolf
        'Sciurus carolinensis'    // Squirrel
    ],
    Insects: [
        'Danaus plexippus',     // Butterfly
        'Formica rufa',         // Ant
        'Apis mellifera',       // Bee
        'Anax junius',          // Dragonfly
        'Coccinella septempunctata' // Beetle
    ],
    Fungi: [
        'Fomitopsis pinicola',      // Red-banded Polypore
        'Coprinus comatus',         // Shaggy Mane
        'Amanita muscaria',         // Fly Agaric
        'Morchella esculenta',      // Morel
        'Pleurotus ostreatus'       // Oyster Mushroom
    ]
};

const teamNames = ["Švilpikai", "Bobausiai", "LED", "Tundra", "Universalai", "Bobausiniai tartigradai", "Laukiniai", "Būdinu rūšis iki karalysčių", "Dream team", "Hienos", "Kapibaros", "Triogloditai", "Beržai keružiai", "Kolibrinis sfinksas", "Kirkutis", "Hayabusa", "Mikro makro"];

function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber() {
    return Math.floor(Math.random() * teamNames.length) + 1;
}

function generateObservation(index: number): ExperResultData {
    const category = getRandomItem(categories);
    const taxon_id = 1000000 + index;
    const totalObservations = getRandomNumber();

    return {
        taxon_id: taxon_id,
        name: getRandomItem(subNames[category as keyof typeof subNames]),
        preferred_common_name: getRandomItem(commonNames[category as keyof typeof commonNames]),
        expert_review: "",
        observations: Array.from({ length: totalObservations }, (_, i) => ({
            id: `${taxon_id}-${i}`,
            points: 1,
            team_name: getRandomItem(teamNames),
            user_name: faker.person.fullName(),
            url: "https://www.inaturalist.org/observations/262499243"
        })),
    };
}

export function generateMockDataForExperts() {
    return Array.from({ length: 500 }, (_, index) => (generateObservation(index)));
}
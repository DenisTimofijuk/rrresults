import { faker } from '@faker-js/faker';

const categories = ['Plants', 'Birds', 'Mammals', 'Insects', 'Fungi'];
const commonNames = {
    Plants: ['Oak', 'Maple', 'Fern', 'Cactus', 'Bamboo'],
    Birds: ['Robin', 'Eagle', 'Sparrow', 'Owl', 'Pelican'],
    Mammals: ['Deer', 'Fox', 'Bear', 'Wolf', 'Squirrel'],
    Insects: ['Butterfly', 'Ant', 'Bee', 'Dragonfly', 'Beetle'],
    Fungi: ['Red-banded Polypore', 'Shaggy Mane', 'Fly Agaric', 'Morel', 'Oyster Mushroom']
};

function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function generateExpertReview() {
    return Math.random() > 0.7 ? faker.lorem.sentence() : "";
}

function generateObservation() {
    const category = getRandomItem(categories);
    return {
        time_observed_at: "2025-02-21 12:54:27",
        name: faker.science.chemicalElement().name,
        preferred_common_name: getRandomItem(commonNames[category as keyof typeof commonNames]),
        points: "",
        expert_review: generateExpertReview(),
        team: "Laukinės meškos",
        user:  "Medinė Kaladėlė",
        "observation-url": "https://www.inaturalist.org/observations/262499243"
    };
}

export function generateMockDataForExperts() {
    return Array.from({ length: 1000 }, (_, index) => ({
        Nr: index + 1,
        ...generateObservation()        
    }));
}

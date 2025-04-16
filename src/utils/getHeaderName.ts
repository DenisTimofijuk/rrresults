export function getHeaderName(key: string) {
    return {
        name: 'Mokslinis Pavadinimas',
        preferred_common_name: 'Lietuviškas pavadinimas',
        expert_review: 'Vertinimas',
        observations: 'Stebėjimai',
        points: 'Taškai',
        team_name: 'Komanda',
        user_name: 'Dalyvis',
        url: 'Nuoroda',
        s: 'Status'
    }[key] || key;
}
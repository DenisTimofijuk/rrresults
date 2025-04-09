export function getHeaderName(key: string) {
    return {
        name: 'Mokslinis Pavadinimas',
        preferred_common_name: 'Įpratas Pavadinimas',
        expert_review: 'Vertinimas',
        observations: 'Stebėjimai',
        points: 'Taškai',
        team_name: 'Komanda',
        user_name: 'Dalyvis',
        url: 'Nuoroda'
    }[key] || key;
}
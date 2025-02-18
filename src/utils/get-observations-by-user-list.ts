// Replace with the specific date, location, and user IDs
const API_URL = 'https://api.inaturalist.org/v1/observations';

export async function fetchObservations(date: string, swlat: number, swlng: number, nelat: number, nelng: number, userIds: string[]) {
    const userQuery = userIds.map((user) => `user_id=${user}`).join('&');
    const url = `${API_URL}?on=${date}&swlat=${swlat}&swlng=${swlng}&nelat=${nelat}&nelng=${nelng}&${userQuery}&per_page=50`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Observations:', data.results);
    } catch (error) {
        console.error('Error fetching observations:', error);
    }
}

/**
 * const date = '2024-09-02'; // Format: yyyy-mm-dd
const swlat = 54.762658; // Southwest latitude of a bounding box query. Allowed values: -90 to 90
const swlng = 25.061890; // Southwest longitude of a bounding box query. Allowed values: -180 to 180
const nelat = 54.787502; // Northeast latitude of a bounding box query. Allowed values: -90 to 90 
const nelng = 25.245616; // Northeast longitude of a bounding box query. Allowed values: -180 to 180
const userIds = ['denis27388', 'milda_butkute']; // List of usernames
// fetchObservations(date, swlat, swlng, nelat, nelng, userIds);
 */
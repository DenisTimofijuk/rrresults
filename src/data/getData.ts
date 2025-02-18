/**
 * fetch JSON results
 * it will be php file which will retusn JSON result from DB
 */

export async function getJSONData<T>(url: string) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: T = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching observations:', error);
        throw error;
    }
}

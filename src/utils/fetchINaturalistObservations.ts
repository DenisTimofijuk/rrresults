import { INaturalistResponse } from '../types/INaturalistObservationsResult';

/**
 * Fetches observation data from iNaturalist API for a specific project
 * @param projectId The project ID to fetch observations for
 * @param page The page number to fetch (defaults to 1)
 * @param perPage The number of results per page (defaults to 50)
 * @returns A Promise containing the API response data
 */
export async function fetchINaturalistObservations(
    projectId: number = 231282,
    page: number = 1,
    perPage: number = 50
) {
    const baseUrl = 'https://api.inaturalist.org/v2/observations';

    // Construct the query parameters
    const params = new URLSearchParams({
        project_id: projectId.toString(),
        ttl: '900',
        return_bounds: 'true',
        per_page: perPage.toString(),
        page: page.toString(),
        fields: '(comments:!t,created_at:!t,created_at_details:all,created_time_zone:!t,faves:!t,id:!t,identifications:(current:!t),latitude:!t,longitude:!t,non_owner_ids:!t,observed_on:!t,observed_on_details:all,observed_time_zone:!t,photos:(id:!t,license_code:!t,original_dimensions:all,url:!t,uuid:!t),place_guess:!t,quality_grade:!t,taxon:(iconic_taxon_name:!t,id:!t,is_active:!t,name:!t,preferred_common_name:!t,preferred_common_names:!t,rank:!t,rank_level:!t,uuid:!t),time_observed_at:!t,user:(icon_url:!t,id:!t,login:!t,name:!t))',
    });

    try {
        const response = await fetch(`${baseUrl}?${params.toString()}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result: INaturalistResponse = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching iNaturalist observations:', error);
        throw error;
    }
}

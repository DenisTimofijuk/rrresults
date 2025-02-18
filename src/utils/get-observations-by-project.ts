import { FetchObservationsByProjectOptions, ObservationResponse } from "../types/ObservationResponse";

/**
 * Fetches observations from iNaturalist API for a specific project
 * @param {number} projectId - The iNaturalist project ID
 * @param {Object} options - Optional parameters
 * @param {number} options.perPage - Number of results per page (default: 50)
 * @param {number} options.ttl - Time to live in seconds (default: 900)
 * @param {boolean} options.returnBounds - Whether to return geographic bounds (default: true)
 * @returns {Promise<Object>} The API response data
 */

export async function fetchObservationsByProject(
    projectId: string,
    options: Partial<FetchObservationsByProjectOptions> = {}
) {
    const { perPage = 50, ttl = 900, returnBounds = true } = options;

    // Define the fields we want to retrieve
    const fields = {
        comments: true,
        created_at: true,
        created_at_details: 'all',
        created_time_zone: true,
        faves: true,
        id: true,
        identifications: {
            current: true,
        },
        latitude: true,
        longitude: true,
        non_owner_ids: true,
        observed_on: true,
        observed_on_details: 'all',
        observed_time_zone: true,
        photos: {
            id: true,
            license_code: true,
            original_dimensions: 'all',
            url: true,
            uuid: true,
        },
        place_guess: true,
        quality_grade: true,
        taxon: {
            iconic_taxon_name: true,
            id: true,
            is_active: true,
            name: true,
            preferred_common_name: true,
            preferred_common_names: true,
            rank: true,
            rank_level: true,
            uuid: true,
        },
        time_observed_at: true,
        user: {
            icon_url: true,
            id: true,
            login: true,
            name: true,
        },
    };

    // Construct the URL with query parameters
    const baseUrl = 'https://api.inaturalist.org/v2/observations';
    const params = new URLSearchParams({
        project_id: projectId.toString(),
        ttl: ttl.toString(),
        return_bounds: `${returnBounds}`,
        per_page: perPage.toString(),
        fields: JSON.stringify(fields),
    });

    try {
        const response = await fetch(`${baseUrl}?${params}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ObservationResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching observations:', error);
        throw error;
    }
}


/**
 * const data = await fetchObservationsByProject('231282', {
        perPage: 100,
        ttl: 1800,
        returnBounds: false,
    });
 */
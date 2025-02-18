// Main response type
export interface INaturalistResponse {
    total_results: number;
    total_bounds: GeographicBounds;
    page: number;
    per_page: number;
    results: Observation[];
}

// Geographic bounds for the search result
interface GeographicBounds {
    swlat: number; // Southwest latitude
    swlng: number; // Southwest longitude
    nelat: number; // Northeast latitude
    nelng: number; // Northeast longitude
}

// Main observation object
interface Observation {
    uuid: string;
    comments: Comment[];
    created_at: string;
    created_at_details: DateDetails;
    created_time_zone: string;
    faves: any[];
    id: number;
    identifications: Identification[];
    non_owner_ids: NonOwnerIdentification[];
    observed_on: string;
    observed_on_details: DateDetails;
    observed_time_zone: string;
    photos: Photo[];
    place_guess: string;
    quality_grade: string;
    taxon: Taxon;
    time_observed_at: string;
    user: User;
}

// Date breakdown into components
interface DateDetails {
    date: string;
    day: number;
    hour: number;
    month: number;
    week: number;
    year: number;
}

// Identification object
interface Identification {
    id: number;
    current: boolean;
}

// Non-owner identification reference
interface NonOwnerIdentification {
    id: number;
}

// Photo information
interface Photo {
    id: number;
    license_code: string;
    original_dimensions: {
        height: number;
        width: number;
    };
    url: string;
}

// Taxonomic information
interface Taxon {
    id: number;
    iconic_taxon_name: string;
    is_active: boolean;
    name: string;
    preferred_common_name: string;
    rank: string;
    rank_level: number;
}

// User information
interface User {
    id: number;
    icon_url: string;
    login: string;
    name: string;
}

// Note: Comments array is empty in the example, so this is a placeholder
interface Comment {
    // Add properties based on actual Comment structure when available
}

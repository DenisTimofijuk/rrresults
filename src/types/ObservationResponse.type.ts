export interface ObservationResponse {
    total_results: number;
    page: number;
    per_page: number;
    results: Observation[];
}

interface Observation {
    uuid: string;
    comments: any[];
    created_at: string;
    created_at_details: DateDetails;
    created_time_zone: string;
    faves: any[];
    id: number;
    identifications: Identification[];
    non_owner_ids: NonOwnerId[];
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

interface DateDetails {
    date: string;
    day: number;
    hour: number;
    month: number;
    week: number;
    year: number;
}

interface Identification {
    id: number;
    current: boolean;
}

interface NonOwnerId {
    id: number;
}

interface Photo {
    id: number;
    license_code: string;
    original_dimensions: {
        height: number;
        width: number;
    };
    url: string;
}

interface Taxon {
    id: number;
    iconic_taxon_name: string;
    is_active: boolean;
    name: string;
    preferred_common_name: string;
    rank: string;
    rank_level: number;
}

interface User {
    id: number;
    icon_url: string;
    login: string;
    name: string;
}

export type FetchObservationsByProjectOptions = {
    perPage: number;
    ttl: number;
    returnBounds: boolean;
};
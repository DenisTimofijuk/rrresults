export type ObservationData = {
    id: number;
    points: number;
    team_name: string;
    user_name: string;
    url: string;
}

export type ExperResultData = {
    taxon_id: number;
    name: string;
    preferred_common_name: string;
    expert_review: string;
    observations: ObservationData[]
}
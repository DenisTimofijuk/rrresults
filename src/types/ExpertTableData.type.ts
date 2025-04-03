export type ObservationAuthor = {
    team_name: string;
    user_name: string;
}

export type ExperResultData = {
    id: number;
    name: string;
    preferred_common_name: string;
    expert_review: string;
    points: number;
    total_observations: ObservationAuthor[];
    url: string;
}
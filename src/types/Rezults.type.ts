export type DataRow = {
    teamName: string;
    data: {
        title: string;
        value: number;
    }[]
    comments: string[];
    total?: number;
};

export type ResultData = DataRow[];
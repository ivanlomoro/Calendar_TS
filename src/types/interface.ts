export interface Event {
    title: string;
    activity: string;
    reminder: any;
    time: any;
    fullTime: string;
}

export interface EventData {
    day: number;
    month: number;
    year: number;
    events: Event[];
}

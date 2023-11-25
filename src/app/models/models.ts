export class Filters {
    boleanValue?: boolean;
    label: string;
    metaThemeColor?: string;
    spinerLoaderColor?: string;
    spinerBgColor?: string;
    spiner?: string;
    value: any;
    primengTheme?: string;
}

export class PointMap {
    title: string;
    label: any;
    position: Position; // {lat, lng} object - in accordance to the API
    options: any;
}

export class Position {
    lat: number;
    lng: number;
}

export class ResponseData{
    success: boolean;
    msg: string;
    payload?: any;
}

export interface HtmlInputEvent extends Event {
    target: HTMLInputElement & EventTarget
}
export class ConfigSite {
    SiteName: string;
    WebApiUrl: string;
    AdminUrl: string;
    DefaultHostName: string;
    CSId: number;
    uploadFilesApi: string;
    previousDisplay: string;
}

export class User {
    petName: string;
    email: string;
    id: string;
    idSecond: number;
    photo: string;
    userState : number;
    name: string;
}


export class TagComponent {
    id: number;
    title: string;
    type: string;
    url: string;
    classes: string;
    icon: string;
    ActiveForProfile: boolean;
}

export class TokenAccess {
    IdTokenAccess: number;
    User: string;
    Token: string;
    IpAddress: string;
    Date: Date;
    SendEmail: boolean;
}

export class TwoFactor {
    IdUser: number;
    Email: string;
    InputCode: string;
    IsTFA: boolean;
}

export class SmartLogin {
    IdUser: number;
    SmartSelection: boolean;
}
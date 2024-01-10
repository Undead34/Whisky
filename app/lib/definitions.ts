export interface IVictims {
    id: string;
    ip: string;
    username: string;
    password: string;
    captureDate: string;
    browser: string;
    os: string;
    country: string;
    countryCode: string;
    city: string;
    isp: string;
    captured: boolean;
    readed: boolean;
    sended: boolean;
    clicks: number;
    visits: number;
}

export interface ILot {
    id: string;
    type: string;
    name: string;
    nodes: string[];
    sended: boolean;
}

export interface ITargets {
    id: string;
    name: string;
    email: string;
    sended: boolean;
}

export interface INode {
    id: string;
    type: string;
    name: string;
    sended: boolean;
    nodes: ITargets[];
  }
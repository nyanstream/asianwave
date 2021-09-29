export type RadioLangType = 'int' | 'ru' | 'en';

export type RadioInfoType = {
    id: string; // MUST be unique!
    title: string;
    lang: RadioLangType;
    iconURL?: string;
    websiteURL?: string;
    streamEndpointURL: string;
    apiEndpointURL: string;
    apiContentResponseType?: 'json' | 'text'; // json by default
};

export type AbstractRadioAPIResponse = {
    trackArtist: string;
    trackTitle: string;
    listeners: number | null;
    isOnAir: boolean;
    djName: string | null;
    airTitle: string | null;
};

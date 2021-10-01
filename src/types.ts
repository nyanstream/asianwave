export type RadioLangType = 'int' | 'ru' | 'en';

export type RadioInfoType = {
    title: string;
    lang: RadioLangType;
    iconURL?: string;
    websiteURL?: string;
    streamEndpointURL: string;
    apiEndpointURL?: string;
    apiContentResponseType?: 'json' | 'text'; // json by default
};

export type RadiosDataObjectType = {
    [id: string]: RadioInfoType;
};

export type AbstractRadioAPIResponse = {
    trackArtist: string;
    trackTitle: string;
    listeners: number | null;
    isOnAir: boolean;
    djName: string | null;
    airTitle: string | null;
};

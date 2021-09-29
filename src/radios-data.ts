import type { RadioInfoType } from './types';

const RadiosData: RadioInfoType[] = [
    {
        id: 'r-a-d-io',
        title: 'R/a/dio',
        lang: 'en',
        websiteURL: 'https://r-a-d.io',
        streamEndpointURL: 'https://stream.r-a-d.io/main',
        apiEndpointURL: 'https://r-a-d.io/api',
    },

    {
        id: 'radio-nami',
        title: 'Radio Nami',
        lang: 'ru',
        websiteURL: 'https://radionami.com',
        streamEndpointURL: 'https://relay.radionami.com/any-anime.ru',
        apiEndpointURL: 'https://radionami.com/jax-info-for-all.php',
        apiContentResponseType: 'text',
    },

    {
        id: 'anison-fm',
        title: 'ANISON.FM',
        lang: 'ru',
        websiteURL: 'https://anison.fm',
        streamEndpointURL: 'https://pool.anison.fm/AniSonFM(320)',
        apiEndpointURL: 'https://anison.fm/status.php',
    },
];

export default RadiosData;

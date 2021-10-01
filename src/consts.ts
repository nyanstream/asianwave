import { version } from '../package.json';

const V1_PREFIX = 'awChrome_v1@';

// Storage values

export const SYNC_STORAGE_RADIO_ITEM_ID = V1_PREFIX + 'radioItemID';

export const SYNC_STORAGE_RADIO_VOLUME = V1_PREFIX + 'radioVolume';

export const LOCAL_STORAGE_RADIOS_DATA = V1_PREFIX + 'radiosData';

export const LOCAL_STORAGE_RADIO_STATE = V1_PREFIX + 'radioState';

export const LOCAL_STORAGE_AUDIO_IS_LOADING = V1_PREFIX + 'audioIsLoading';

// Runtime messages cmd

export const MESSAGE_AUDIO_VOLUME_CHANGE = V1_PREFIX + 'audio-volume-change';

// Consts

export const APP_VERSION = version;

export const RADIOS_DATA_URL = 'https://raw.githubusercontent.com/nyanstream/radios-data/main/data/data.json';

export const RADIO_DEFAULT_VOLUME = 50;

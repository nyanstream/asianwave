import debounce from 'lodash.debounce';

import type { RadiosDataObjectType, RadioInfoType } from './types';

import { RADIOS_DATA_URL, RADIO_DEFAULT_VOLUME } from './consts';

import { LOCAL_STORAGE_RADIOS_DATA, SYNC_STORAGE_RADIO_ITEM_ID } from './consts';
import { SYNC_STORAGE_RADIO_VOLUME, LOCAL_STORAGE_RADIO_STATE } from './consts';
import { LOCAL_STORAGE_AUDIO_IS_LOADING } from './consts';
import { MESSAGE_AUDIO_VOLUME_CHANGE } from './consts';

import { storageChangesChecker } from './utilities';

let radiosData: RadiosDataObjectType | undefined = void 0;

let currentRadioData: RadioInfoType | undefined = void 0;

const getOrUpdateRadiosData = async () => {
    await fetch(RADIOS_DATA_URL, { cache: 'no-store' })
        .then(r => r.json())
        .then(data => {
            chrome.storage.local.set({ [LOCAL_STORAGE_RADIOS_DATA]: data });
        });
};

const Player = new Audio();

Player.preload = 'none';

const onAudioLoadingStart = () => {
    chrome.storage.local.set({ [LOCAL_STORAGE_AUDIO_IS_LOADING]: true });
};

const onAudioLoadingEndWithAnyResult = () => {
    console.log('loaded');
    chrome.storage.local.set({ [LOCAL_STORAGE_AUDIO_IS_LOADING]: false });
};

Player.addEventListener('playing', onAudioLoadingEndWithAnyResult);
Player.addEventListener('error', onAudioLoadingEndWithAnyResult);

const advancedPlay = () => {
    onAudioLoadingStart();
    Player.load();
    Player.play();
};

// для установки громкости используется sendMessage, потому что на установку
// значений в storage есть ограничения по кол-ву раз в минуту
const debouncedAudioVolumeSave = debounce((volumeValue: number) => {
    chrome.storage.sync.set({ [SYNC_STORAGE_RADIO_VOLUME]: volumeValue });
}, 500);

const init = async () => {
    await getOrUpdateRadiosData();

    chrome.storage.local.set({ [LOCAL_STORAGE_AUDIO_IS_LOADING]: false, [LOCAL_STORAGE_RADIO_STATE]: 'pause' });

    chrome.storage.local.get([LOCAL_STORAGE_RADIOS_DATA], storageItems => {
        if (LOCAL_STORAGE_RADIOS_DATA in storageItems) {
            radiosData = storageItems[LOCAL_STORAGE_RADIOS_DATA];
        } else {
            console.warn('Не удалось загрузить радио! :(');
        }
    });

    chrome.storage.sync.get([SYNC_STORAGE_RADIO_ITEM_ID, SYNC_STORAGE_RADIO_VOLUME], storageItems => {
        if (radiosData) {
            if (SYNC_STORAGE_RADIO_ITEM_ID in storageItems) {
                currentRadioData = radiosData[storageItems[SYNC_STORAGE_RADIO_ITEM_ID]];

                Player.src = currentRadioData.streamEndpointURL;
            } else {
                const RadiosDataID = Object.keys(radiosData);

                chrome.storage.sync.set({ [SYNC_STORAGE_RADIO_ITEM_ID]: RadiosDataID[0] });
            }
        }

        if (SYNC_STORAGE_RADIO_VOLUME in storageItems) {
            Player.volume = storageItems[SYNC_STORAGE_RADIO_VOLUME] / 100;
        } else {
            chrome.runtime.sendMessage({ cmd: MESSAGE_AUDIO_VOLUME_CHANGE, value: RADIO_DEFAULT_VOLUME });
        }
    });
};

init();

chrome.storage.onChanged.addListener(storageChanges => {
    if (storageChangesChecker(storageChanges, LOCAL_STORAGE_RADIOS_DATA)) {
        radiosData = storageChanges[LOCAL_STORAGE_RADIOS_DATA].newValue;
    }

    if (storageChangesChecker(storageChanges, SYNC_STORAGE_RADIO_ITEM_ID)) {
        currentRadioData = radiosData?.[storageChanges[SYNC_STORAGE_RADIO_ITEM_ID].newValue];

        if (currentRadioData) {
            Player.src = currentRadioData.streamEndpointURL;
        }
    }

    if (storageChangesChecker(storageChanges, LOCAL_STORAGE_RADIO_STATE)) {
        switch (storageChanges[LOCAL_STORAGE_RADIO_STATE].newValue) {
            case 'play':
                advancedPlay();
                break;

            case 'pause':
                Player.pause();
                break;
        }
    }
});

chrome.runtime.onMessage.addListener(message => {
    if ('cmd' in message) {
        switch (message.cmd) {
            case MESSAGE_AUDIO_VOLUME_CHANGE:
                Player.volume = message.value / 100;
                debouncedAudioVolumeSave(message.value);
                break;
        }
    }
});

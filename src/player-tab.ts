import type { RadioInfoType } from './types';

import { SYNC_STORAGE_RADIO_ITEM_ID, MESSAGE_RADIO_ID_CHANGE } from './consts';
import { SYNC_STORAGE_RADIO_VOLUME, MESSAGE_RADIO_VOLUME_CHANGE } from './consts';
import { MESSAGE_RADIO_PLAY_EVENT, MESSAGE_RADIO_PAUSE_EVENT } from './consts';
import { RADIO_DEFAULT_VOLUME, LOCAL_STORAGE_RADIO_STATE } from './consts';
import { MESSAGE_RADIO_AUDIO_IS_LOADING, MESSAGE_RADIO_AUDIO_IS_LOADED } from './consts';

import RadiosData from './radios-data';

let currentRadioData: RadioInfoType | undefined = void 0;

const Player = new Audio();

Player.preload = 'none';

chrome.storage.sync.get([SYNC_STORAGE_RADIO_ITEM_ID, SYNC_STORAGE_RADIO_VOLUME], storageItems => {
    if (SYNC_STORAGE_RADIO_ITEM_ID in storageItems) {
        currentRadioData = RadiosData[storageItems[SYNC_STORAGE_RADIO_ITEM_ID]];

        Player.src = currentRadioData.streamEndpointURL;

        chrome.runtime.sendMessage(MESSAGE_RADIO_ID_CHANGE);
    } else {
        // first install?
        const RadiosDataID = Object.keys(RadiosData);

        chrome.storage.sync.set({ [SYNC_STORAGE_RADIO_ITEM_ID]: RadiosDataID[0] });

        currentRadioData = RadiosData[RadiosDataID[0]];

        Player.src = currentRadioData.streamEndpointURL;

        chrome.runtime.sendMessage(MESSAGE_RADIO_ID_CHANGE);
    }

    if (SYNC_STORAGE_RADIO_VOLUME in storageItems) {
        Player.volume = Number(storageItems[SYNC_STORAGE_RADIO_VOLUME]) / 100;
    } else {
        Player.volume = RADIO_DEFAULT_VOLUME / 100;

        chrome.storage.sync.set({ [SYNC_STORAGE_RADIO_VOLUME]: String(RADIO_DEFAULT_VOLUME) });

        chrome.runtime.sendMessage(MESSAGE_RADIO_VOLUME_CHANGE);
    }
});

chrome.runtime.onMessage.addListener(message => {
    switch (message) {
        case MESSAGE_RADIO_ID_CHANGE: {
            chrome.storage.sync.get(SYNC_STORAGE_RADIO_ITEM_ID, storageItems => {
                if (SYNC_STORAGE_RADIO_ITEM_ID in storageItems) {
                    currentRadioData = RadiosData[storageItems[SYNC_STORAGE_RADIO_ITEM_ID]];

                    Player.src = currentRadioData.streamEndpointURL;
                }
            });
            break;
        }

        case MESSAGE_RADIO_PLAY_EVENT: {
            Player.load();

            chrome.runtime.sendMessage(MESSAGE_RADIO_AUDIO_IS_LOADING);

            const loadHandler = () => {
                Player.play();

                chrome.runtime.sendMessage(MESSAGE_RADIO_AUDIO_IS_LOADED);

                Player.removeEventListener('load', loadHandler);
            };

            Player.addEventListener('load', loadHandler);

            chrome.storage.local.set({ [LOCAL_STORAGE_RADIO_STATE]: 'play' });

            break;
        }

        case MESSAGE_RADIO_PAUSE_EVENT: {
            Player.pause();

            chrome.storage.local.set({ [LOCAL_STORAGE_RADIO_STATE]: 'pause' });

            break;
        }

        case MESSAGE_RADIO_VOLUME_CHANGE: {
            chrome.storage.sync.get(SYNC_STORAGE_RADIO_VOLUME, storageItems => {
                if (SYNC_STORAGE_RADIO_VOLUME in storageItems) {
                    Player.volume = Number(storageItems[SYNC_STORAGE_RADIO_VOLUME]) / 100;
                }
            });
            break;
        }
    }
});

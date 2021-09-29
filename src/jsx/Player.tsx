import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';

import { MESSAGE_RADIO_ID_CHANGE } from '../consts';
import { LOCAL_STORAGE_RADIO_STATE } from '../consts';
import { MESSAGE_RADIO_PLAY_EVENT, MESSAGE_RADIO_PAUSE_EVENT } from '../consts';
import { MESSAGE_RADIO_VOLUME_CHANGE, SYNC_STORAGE_RADIO_VOLUME } from '../consts';

import { RADIO_DEFAULT_VOLUME } from '../consts';

import playIcon from '../icons/play.svg';
import pauseIcon from '../icons/pause.svg';

const Player = () => {
    const [PlayerState, setPlayerState] = useState<'play' | 'pause'>('pause');
    const [CurrentVolume, setCurrentVolume] = useState(RADIO_DEFAULT_VOLUME);

    useEffect(() => {
        chrome.storage.local.get([LOCAL_STORAGE_RADIO_STATE], storageItems => {
            const ddd = document.querySelector('.header__brandText');

            if (ddd) ddd.innerHTML = JSON.stringify(storageItems);

            if (LOCAL_STORAGE_RADIO_STATE in storageItems) {
                setPlayerState(storageItems[LOCAL_STORAGE_RADIO_STATE]);
            }
        });

        chrome.storage.sync.get([SYNC_STORAGE_RADIO_VOLUME], storageItems => {
            if (SYNC_STORAGE_RADIO_VOLUME in storageItems) {
                setCurrentVolume(storageItems[SYNC_STORAGE_RADIO_VOLUME]);
            }
        });

        chrome.runtime.onMessage.addListener(message => {
            switch (message) {
                case MESSAGE_RADIO_ID_CHANGE: {
                    setPlayerState('pause');
                    break;
                }
            }
        });
    }, []);

    const playPauseButtonClickHandler = useCallback((currentState: typeof PlayerState) => {
        const NewState: typeof PlayerState = currentState === 'play' ? 'pause' : 'play';

        setPlayerState(NewState);

        chrome.storage.local.set({ [LOCAL_STORAGE_RADIO_STATE]: NewState });

        chrome.runtime.sendMessage(currentState === 'play' ? MESSAGE_RADIO_PAUSE_EVENT : MESSAGE_RADIO_PLAY_EVENT);
    }, []);

    const volumeChangeHandler = useCallback((value: number) => {
        setCurrentVolume(value);

        chrome.storage.sync.set({ [SYNC_STORAGE_RADIO_VOLUME]: String(value) });

        chrome.runtime.sendMessage(MESSAGE_RADIO_VOLUME_CHANGE);
    }, []);

    return (
        <div className="player" data-state={CurrentVolume} style={{ '--volume': `${CurrentVolume}%` }}>
            <button
                className="player__playPauseBtn"
                onClick={() => playPauseButtonClickHandler(PlayerState)}
                dangerouslySetInnerHTML={{ __html: PlayerState === 'pause' ? playIcon : pauseIcon }}></button>
            <input
                class="player__volumeInput"
                type="range"
                value={CurrentVolume}
                onInput={event => volumeChangeHandler(Number(event.currentTarget.value))}
                step="1"
                min="0"
                max="100"
            />
        </div>
    );
};

export default Player;

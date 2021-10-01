import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';

import { RADIO_DEFAULT_VOLUME } from '../consts';

import { LOCAL_STORAGE_RADIO_STATE, LOCAL_STORAGE_AUDIO_IS_LOADING } from '../consts';
import { SYNC_STORAGE_RADIO_VOLUME } from '../consts';
import { MESSAGE_AUDIO_VOLUME_CHANGE } from '../consts';

import { storageChangesChecker } from '../utilities';

import playIcon from '../icons/play.svg';
import pauseIcon from '../icons/pause.svg';

const Player = () => {
    const [PlayerState, setPlayerState] = useState<'play' | 'pause'>('pause');
    const [CurrentVolume, setCurrentVolume] = useState(RADIO_DEFAULT_VOLUME);

    const [IsAudioLoading, setIsAudioLoading] = useState(false);

    useEffect(() => {
        chrome.storage.local.get([LOCAL_STORAGE_RADIO_STATE, LOCAL_STORAGE_AUDIO_IS_LOADING], storageItems => {
            if (LOCAL_STORAGE_RADIO_STATE in storageItems) {
                setPlayerState(storageItems[LOCAL_STORAGE_RADIO_STATE]);
            }

            if (LOCAL_STORAGE_AUDIO_IS_LOADING in storageItems) {
                if (storageItems[LOCAL_STORAGE_AUDIO_IS_LOADING]) {
                    setIsAudioLoading(true);
                }
            }
        });

        chrome.storage.sync.get([SYNC_STORAGE_RADIO_VOLUME], storageItems => {
            if (SYNC_STORAGE_RADIO_VOLUME in storageItems) {
                setCurrentVolume(storageItems[SYNC_STORAGE_RADIO_VOLUME]);
            }
        });

        chrome.storage.onChanged.addListener(storageChanges => {
            console.log(storageChanges);

            if (storageChangesChecker(storageChanges, LOCAL_STORAGE_AUDIO_IS_LOADING)) {
                setIsAudioLoading(storageChanges[LOCAL_STORAGE_AUDIO_IS_LOADING].newValue);
            }
        });
    }, []);

    const playPauseButtonClickHandler = useCallback((currentState: typeof PlayerState) => {
        const NewState: typeof PlayerState = currentState === 'play' ? 'pause' : 'play';

        setPlayerState(NewState);

        chrome.storage.local.set({ [LOCAL_STORAGE_RADIO_STATE]: NewState });
    }, []);

    const volumeChangeHandler = useCallback((value: number) => {
        setCurrentVolume(value);

        // здесь используется sendMessage, потому что на установку
        // значений в storage есть ограничения
        chrome.runtime.sendMessage({ cmd: MESSAGE_AUDIO_VOLUME_CHANGE, value });
    }, []);

    return (
        <div
            className="player"
            style={{ '--volume': `${CurrentVolume}%` }}
            data-state={CurrentVolume}
            data-is-audio-loading={IsAudioLoading ? '' : null}>
            <button
                className="player__playPauseBtn"
                onClick={() => playPauseButtonClickHandler(PlayerState)}
                dangerouslySetInnerHTML={{ __html: PlayerState === 'pause' ? playIcon : pauseIcon }}
                disabled={IsAudioLoading}
            />
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

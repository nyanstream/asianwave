import { h, Fragment } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';

import playIcon from '../icons/play.svg';
import pauseIcon from '../icons/pause.svg';

const Player = () => {
    const [PlayerState, setPlayerState] = useState<'play' | 'pause'>('pause');
    const [CurrentVolume, setCurrentVolume] = useState(80);

    const playPauseButtonClickHandler = useCallback((currentState: typeof PlayerState) => {
        setPlayerState(currentState === 'play' ? 'pause' : 'play');
    }, []);

    const volumeChangeHandler = useCallback((value: number) => {
        setCurrentVolume(value);
    }, []);

    return (
        <div className="player" data-state={CurrentVolume} style={{ '--volume': `${CurrentVolume}%` }}>
            <button
                className="player__playPauseBtn"
                onClick={() => playPauseButtonClickHandler(PlayerState)}
                dangerouslySetInnerHTML={{ __html: PlayerState === 'play' ? playIcon : pauseIcon }}></button>
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

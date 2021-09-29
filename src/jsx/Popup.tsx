import { h, Fragment } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';

import Player from './Player';

import cogIcon from '../icons/cog.svg';

const Popup = () => {
    const handleOptionsButtonClick = useCallback(() => {
        chrome.runtime.openOptionsPage();
    }, []);

    return (
        <>
            <header className="header">
                <div className="header__segment header__segment--left">
                    <picture className="header__brand">
                        <img src="../assets/logo.png" alt="logo" />
                    </picture>
                    <h1 className="header__brandText">Asian Wave</h1>
                </div>
                <div className="header__segment header__segment--right">
                    <div className="header__settings" onClick={handleOptionsButtonClick}>
                        <button title="Открыть настройки" dangerouslySetInnerHTML={{ __html: cogIcon }} />
                    </div>
                </div>
            </header>
            <main className="main">
                <Player />
            </main>
        </>
    );
};

export default <Popup />;

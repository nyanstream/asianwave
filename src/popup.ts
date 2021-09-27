import 'preact/debug';
import { h, render } from 'preact';

import App from './PopupJSX/Popup';

import './styles/popup.scss';

const AppRoot = document.getElementById('root');

if (AppRoot) {
    render(App, AppRoot);
}

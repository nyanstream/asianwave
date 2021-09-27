import 'preact/debug';
import { render } from 'preact';

import App from './jsx/Popup';

import './styles/popup.scss';

const AppRoot = document.getElementById('root');

if (AppRoot) {
    render(App, AppRoot);
}

import 'preact/debug';
import { render } from 'preact';

import App from './jsx/Options';

import './styles/options.scss';

const AppRoot = document.getElementById('root');

if (AppRoot) {
    render(App, AppRoot);
}

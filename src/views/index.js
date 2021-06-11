import { Component } from 'react';

import logo from './logo.svg';
import './index.css';

export default class index extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                </header>
            </div>
        );
    }
}

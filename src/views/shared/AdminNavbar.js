import { Component } from 'react'
import { Link } from "react-router-dom"
import { UilListUiAlt } from '@iconscout/react-unicons'

export default class AdminNavbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark shadow bg-dark fixed-top">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand"><UilListUiAlt size="40" /></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Menü">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="mainNavbar">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Anasayfa</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="!#" id="proposeMenu" data-bs-toggle="dropdown" aria-expanded="false">Teklifler</a>
                                <ul className="dropdown-menu" aria-labelledby="proposeMenu">
                                    <li><Link to="/admin/proposes/add" className="dropdown-item">Teklif Ekle</Link></li>
                                    <li><Link to="/admin/proposes" className="dropdown-item">Teklifler</Link></li>
                                </ul>
                            </li>
                        </ul>
                        <div className="dropdown text-end">
                            <a href="!#" className="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="https://github.com/berkaydavas.png" alt="Berkay Davas" width="32" height="32" className="rounded-circle" />
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end text-small" aria-labelledby="dropdownUser1">
                                <li className="dropdown-item">{this.props.userName}</li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="!#" onClick={this.props.logout}>Çıkış</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}
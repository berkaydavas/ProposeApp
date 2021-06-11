import { Component, React } from 'react'
import { Route, Switch, Redirect } from "react-router-dom"

import appRoutes from "../../routes"
import "../../assets/css/style.css"

import AdminNavbar from "./AdminNavbar"

import { UilLinkH, UilGithub } from '@iconscout/react-unicons'

const getRoutes = (routes) => {
    return routes.map((prop, key) => {
        if (prop.layout === "/admin") {
            return (
                <Route
                    path={prop.layout + prop.path}
                    component={prop.component}
                    key={key}
                />
            );
        } else {
            return null;
        }
    });
};

export default class AdminLayout extends Component {
    render() {
        return (
            <>
                <AdminNavbar userName={this.props.userName} logout={this.props.logout} />
                <div className="container-fluid main-content">
                    <div className="py-5">
                        <Switch>
                            {getRoutes(appRoutes)}
                            <Redirect from="*" to="/admin/index" />
                        </Switch>
                    </div>
                </div>                    
                <footer className="py-3 mt-auto">
                    <div className="container-fluid d-flex align-items-center justify-content-between">
                        <p>
                            <span>&copy; 2021</span>
                            <span> | <UilLinkH size="18" /> <a href="https://berkaydavas.com" target="_blank" rel="noreferrer">Berkay Davas</a></span>
                            <span> | <UilGithub size="18" /> <a href="https://github.com/berkaydavas" target="_blank" rel="noreferrer">GitHub</a></span>
                        </p>
                        <p>1.01.1</p>
                    </div>
                </footer>
            </>
        );
    }
}
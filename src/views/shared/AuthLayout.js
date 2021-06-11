import { React, Component } from 'react'
import { Route, Switch, Redirect } from "react-router-dom"

import { UilListUiAlt } from '@iconscout/react-unicons'
import "../../assets/css/signin.css"

import Login from "../auth/login"

export default class AuthLayout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageTitle: ""
        }

        this.setCardTitle = (title) => {
            this.setState({
                pageTitle: title
            })
        }
    }

    render() {
        return (
            <div id="auth-wrap">
                <main className="form-signin">
                    <UilListUiAlt size="90" />
                    <h1 className="h3 my-3 fw-normal">{this.state.pageTitle}</h1>
                    <Switch>
                        <Route path="/auth/login" render={(props) => <Login {...props} setCardTitle={this.setCardTitle} />} />
                        <Redirect from="*" to="/auth/login" />
                    </Switch>
                    <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
                </main>
            </div>
        );
    }
}
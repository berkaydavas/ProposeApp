import { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from 'axios';

import AdminLayout from "./views/shared/AdminLayout";
import AuthLayout from "./views/shared/AuthLayout";

axios.defaults.baseURL = "https://propose-api.berkaydavas.com/";

export default class App extends Component {
	constructor() {
		super();

		this.state = {
			loggedIn: false,
			loginToken: localStorage.getItem("loginToken"),
			userName: localStorage.getItem("userName"),
			userId: "",
			tokenExpire: localStorage.getItem("tokenExpire")
		}

		if ((this.state.loginToken !== "" && this.state.loginToken !== null) && new Date(this.state.tokenExpire) >= new Date(Date.now())) {
			axios.defaults.headers.common['Authorization'] = "Bearer " + this.state.loginToken;
			
			this.state.loggedIn = true;
		}

        this.logout = this.logout.bind(this);
	}

	componentDidMount() {
		if (this.state.loggedIn) {
			const component = this;

			const config = {
				method: "get",
				url: "Account/UserInfo"
			};

			axios(config)
				.then(function (response) {
					component.setState({
						userId: response.data.Id
					});
				})
				.catch(function (err) {
					component.setState({
						loggedIn: false
					});
				});
		}
	}

	logout(event) {
		event.preventDefault();

		this.setState({
			loggedIn: false
		});

		localStorage.setItem("loginToken", "");
		localStorage.setItem("tokenExpire", "");
		localStorage.setItem("userName", "");

		axios.defaults.headers.common['Authorization'] = "";
	}

	render() {
		if (!this.state.loggedIn) {
			return (
				<BrowserRouter>				
					<AuthLayout />
				</BrowserRouter>
			);
		}

		return (
			<BrowserRouter>
				<Switch>
					<Route path="/admin" render={(props) => <AdminLayout {...props} userName={this.state.userName} logout={this.logout} />} />
					<Redirect from="/" to="/admin/index" />
				</Switch>
			</BrowserRouter>
		);
	}
}

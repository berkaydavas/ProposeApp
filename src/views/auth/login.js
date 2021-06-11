import { Component } from 'react'
import axios from "axios"

const qs = require('qs');

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.props.setCardTitle("Oturum Açın");

        this.state = {
            redirect: false,
            userName: "",
            password: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const data = qs.stringify({
            "grant_type": "password",
            "username": this.state.userName,
            "password": this.state.password
        });

        const config = {
            method: "post",
            url: "Token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: data
        }

        axios(config)
            .then(res => {
                if (res.data.error != null) {
                    alert(res.data.error_description);
                } else {
                    localStorage.setItem("loginToken", res.data.access_token);
                    localStorage.setItem("userName", res.data.userName);
                    localStorage.setItem("tokenExpire", res.data[".expires"]);

                    setTimeout(function () {
                        window.location.reload();
                    }, 200);
                }
            })
            .catch(err => {
                alert(`Bir hata oluştu!\nHata: ${err.response.data.error}\nHata Açıklaması: ${err.response.data.error_description}`);
                console.error(err);
            });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-floating">
                    <input type="text" className="form-control" id="userName" placeholder="Kullanıcı Adı" name="userName" autoComplete="off" onChange={this.handleChange} required />
                    <label htmlFor="userName">Kullanıcı Adı</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="password" placeholder="Parola" name="password" autoComplete="off" onChange={this.handleChange} required />
                    <label htmlFor="password">Parola</label>
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100"><i className="ft-unlock"></i> Oturum Aç</button>
            </form>
        );
    }
}
import { Component } from 'react';
import { Redirect } from "react-router-dom";
import _ from 'lodash'
import axios from 'axios'

import PageHeader from '../components/PageHeader'
import { formatDate } from '../../helpers/helpers'

const qs = require('qs');

export default class Add extends Component {
    constructor() {
        super();

        this.state = {
            redirect: false,
            propose: {
                id: 0,
                name: "",
                description: "",
                customer: "",
                company: "",
                inCharge: "",
                project: "",
                startDate: formatDate(new Date()),
                currency: 2
            },
            currencies: []
        }

        this.handleProposeChange = this.handleProposeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const component = this;

        const config = {
            method: "get",
            url: "Currencies/Take?onlyPrimaries=true",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };

        axios(config)
            .then(function (response) {
                component.setState({
                    currencies: response.data
                });
            })
            .catch(function (err) {
                if (err.response != null) {
                    alert(`Bir hata oluştu!\nHata Açıklaması: ${err.response.data.Message}`);
                } else {
                    alert(`Bir hata oluştu!`);
                }
                console.error(err);
            });
    }

    handleProposeChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        var statePropose = this.state.propose;
        statePropose[name] = value;
    
        this.setState({
            propose: statePropose
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const component = this;

        const data = qs.stringify(this.state.propose);

        const config = {
            method: 'post',
            url: 'Proposes/Add',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                if (response.data.id != null) {
                    component.setState({
                        redirect: true,
                        propose: response.data
                    });
                }
            })
            .catch(function (err) {
                if (err.response != null) {
                    alert(`Bir hata oluştu!\nHata Açıklaması: ${err.response.data.Message}`);
                } else {
                    alert(`Bir hata oluştu!`);
                }
                console.error(err);
            });
    }

    render() {
        if (this.state.redirect) {
            return (
                <Redirect to={`/admin/proposes/edit/${this.state.propose.id}`} />
            );
        }

        return (
            <>
                <PageHeader
                    title="TEKLİF EKLE"
                    buttons={
                        [
                            {
                                href: "/admin/proposes",
                                text: "Teklifler",
                                icon: <i className="ft-list"></i>,
                                color: "secondary"
                            }
                        ]
                    } />
                
                <div className="row">
                    <div className="col-md-12">
                        <div className="card rounded shadow">
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <div className="form-group form-floating">
                                                <input
                                                    type="text"
                                                    id="proposeName"
                                                    className="form-control"
                                                    name="name"
                                                    value={this.state.propose.name}
                                                    placeholder="Teklif Adı"
                                                    maxLength="255"
                                                    autoComplete="off"
                                                    onChange={this.handleProposeChange}
                                                    required />
                                                <label className="label-control" htmlFor="proposeName">Teklif Adı*</label>
                                            </div>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="form-group form-floating">
                                                <textarea
                                                    id="proposeDescription"
                                                    className="form-control"
                                                    name="description"
                                                    value={this.state.propose.description ?? ""}
                                                    placeholder="Teklif Açıklaması"
                                                    maxLength="1000"
                                                    rows="1"
                                                    onChange={this.handleProposeChange}
                                                ></textarea>
                                                <label className="label-control" htmlFor="proposeDescription">Teklif Açıklaması</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-3">                                            
                                        <div className="col-md-6">
                                            <div className="form-group form-floating">
                                                <input
                                                    type="text"
                                                    id="proposeCustomer"
                                                    className="form-control"
                                                    name="customer"
                                                    value={this.state.propose.customer}
                                                    placeholder="Müşteri"
                                                    maxLength="255"
                                                    autoComplete="off"
                                                    onChange={this.handleProposeChange}
                                                    required />                                                        
                                                <label className="label-control" htmlFor="proposeCustomer">Müşteri*</label>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group form-floating">
                                                <input
                                                    type="text"
                                                    id="proposeCompany"
                                                    className="form-control"
                                                    name="company"
                                                    value={this.state.propose.company ?? ""}
                                                    placeholder="Firma"
                                                    maxLength="255"
                                                    autoComplete="off"
                                                    onChange={this.handleProposeChange} />                                                    
                                                <label className="label-control" htmlFor="proposeCompany">Firma</label>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group form-floating">
                                                <input
                                                    type="text"
                                                    id="proposeInCharge"
                                                    className="form-control"
                                                    name="inCharge"
                                                    value={this.state.propose.inCharge ?? ""}
                                                    placeholder="Yetkili"
                                                    maxLength="150"
                                                    autoComplete="off"
                                                    onChange={this.handleProposeChange} />                                                    
                                                <label className="label-control" htmlFor="proposeInCharge">Yetkili</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <div className="form-group form-floating">
                                                <input
                                                    type="text"
                                                    id="proposeProject"
                                                    className="form-control"
                                                    name="project"
                                                    value={this.state.propose.project}
                                                    placeholder="Proje"
                                                    maxLength="255"
                                                    autoComplete="off"
                                                    onChange={this.handleProposeChange}
                                                    required />                                                    
                                                <label className="label-control" htmlFor="proposeProject">Proje*</label>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group form-floating">
                                                <input
                                                    type="datetime-local"
                                                    id="proposeStartDate"
                                                    className="form-control"
                                                    name="startDate"
                                                    value={this.state.propose.startDate}
                                                    placeholder="Baş. Tarihi"
                                                    maxLength="255"
                                                    autoComplete="off"
                                                    onChange={this.handleProposeChange}
                                                    required />                                                    
                                                <label className="label-control" htmlFor="proposeStartDate">Baş. Tarihi</label>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group form-floating">
                                                <select
                                                    id="proposeCurrency"
                                                    className="form-select"
                                                    name="currency"
                                                    autoComplete="off"
                                                    value={this.state.propose.currency}
                                                    onChange={this.handleProposeChange}
                                                >
                                                    {
                                                        this.state.currencies && this.state.currencies.map(curr =>
                                                            <option key={_.uniqueId("currOption-")} value={curr.id}>{curr.code}</option>    
                                                        )
                                                    }
                                                </select>
                                                <label className="label-control" htmlFor="proposeCurrency">Kur*</label>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Kaydet</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
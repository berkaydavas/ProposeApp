import { Component } from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'
import _ from 'lodash'

import { UilEdit, UilEye } from '@iconscout/react-unicons'
import PageHeader from '../components/PageHeader'

import { formatDecimal, formatDate } from '../../helpers/helpers'

export default class Proposes extends Component {
    constructor() {
        super();

        this.state = {
            proposes: []
        }
    }

    componentDidMount() {
        const component = this;

        const config = {
            method: "get",
            url: "Proposes/Take"
        };

        axios(config)
            .then(function (response) {
                component.setState({
                    proposes: response.data
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

    render() {
        return (
            <>
                <PageHeader
                    title="TEKLİFLERİM"
                    buttons={[
                        {
                            href: "/admin/proposes/add/",
                            text: "Teklif Ekle",
                            icon: <i className="ft-plus"></i>,
                            color: "success"
                        }
                    ]}
                />
                <div className="row">
                    <div className="col-md-12">
                        <div className="card rounded shadow">
                            <div className="card-body">
                                <table className="table table-sm table-striped table-bordered mb-0 table-responsive-sm">
                                    <thead>
                                        <tr>
                                            <th width="50">#</th>
                                            <th>Adı</th>
                                            <th>Açıklama</th>
                                            <th>Müşteri</th>
                                            <th width="160">Tutar</th>
                                            <th width="100">Baş. Tar.</th>
                                            <th>Oluşturan</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.proposes && this.state.proposes.map(propose =>
                                                <tr key={_.uniqueId("proposeTableLine-")}>
                                                    <td>{propose.id}</td>
                                                    <td>{propose.name}</td>
                                                    <td>{propose.description}</td>
                                                    <td>{propose.customer}</td>
                                                    <td className="text-end"><span className="float-start">{propose.currency.symbol}</span>{formatDecimal(propose.totalPrice)}</td>
                                                    <td>{formatDate(propose.createdDate, "small")}</td>                                                    
                                                    <td>{propose.createdBy.userName}</td>
                                                    <td className="p-1">
                                                        <Link to={`/admin/proposes/edit/${propose.id}`} className="btn btn-sm btn-link py-0 fs-6 text-decoration-none"><UilEdit size="20" /></Link>
                                                        <Link to={`/admin/proposes/detail/${propose.id}`} className="btn btn-sm btn-link text-black-50 ml-2 py-0 fs-6 text-decoration-none disabled"><UilEye size="20" /></Link>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
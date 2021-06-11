import { Component } from 'react'
import _ from 'lodash'
import axios from 'axios'

import { UilSave, UilCheck, UilListUl, UilPercentage, UilArrowsShrinkH, UilPlus, UilPlusSquare } from '@iconscout/react-unicons'

import PageHeader from '../components/PageHeader'
import MainTitle from '../components/propose/MainTitle'
import ProductLine from '../components/propose/ProductLine'

import { formatDate, formatDecimal, sumLineChildrenPrices } from '../../helpers/helpers'
import './edit.css'

const qs = require('qs');

export default class Edit extends Component {
    constructor(props) {
        super(props);

        this.letters = [];
        for (var i = 65; i <= 90; i++)
            this.letters.push(String.fromCharCode(i));
    
        const lettersTemp = this.letters;
        lettersTemp.forEach(x => {
            for (var k = 65; k <= 90; k++)
                this.letters.push(x + String.fromCharCode(k));
        });

        this.state = {
            proposeId: this.props.match.params.id,
            propose: {
                id: 0,
                name: "",
                description: "",
                customer: "",
                company: "",
                inCharge: "",
                project: "",
                startDate: formatDate(new Date()),
                exrateDate: formatDate(new Date()),
                currency: {},
                createdBy: {},
                createdDate: formatDate(new Date())
            },
            currencies: [],
            brands: [],
            lines: [],
            tableViewMode: "lines",
            tableColspan: 8,
            footerColspan: 7
        }

        this.translateProductPrice = (prdCurrId, prdPrice) => {
            const prdCurr = this.state.currencies.find(x => x.id === prdCurrId);
            const prdCurrTL = prdCurr == null ? 0 : prdCurr.value;

            const prpCurrTL = this.state.currencies.find(x => x.id === this.state.propose.currency.id).value;

            const currRate = prdCurrTL / prpCurrTL;

            return parseFloat((currRate * prdPrice).toFixed(2).replace(",", "."));
        };

        this.calculateProductLines = (children) => {
            const component = this;
            children.forEach(function (x, index) {
                if (x.type === 0) {
                    const proposeCurrPrice = component.translateProductPrice(x.priceCurrency.id, x.productPrice);
                    const discountedPrice = proposeCurrPrice * x.discountRate1;
                    const discountedPrice1 = proposeCurrPrice - discountedPrice;
                    const discountedPrice2 = discountedPrice * (1 - x.discountRate2);
    
                    children[index].discountPrice1 = parseFloat(discountedPrice1.toFixed(2).replace(",", "."));
                    children[index].discountPrice2 = parseFloat(discountedPrice2.toFixed(2).replace(",", "."));
                    children[index].unitPrice = parseFloat((proposeCurrPrice - discountedPrice1 - discountedPrice2).toFixed(2).replace(",", "."));
                } else {    
                    children[index].children = component.calculateProductLines(x.children);
                }
            });
        
            return children;
        }

        this.updateCurrencies = this.updateCurrencies.bind(this);
        this.handleProposeChange = this.handleProposeChange.bind(this);
        this.handleProposeTableChange = this.handleProposeTableChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleTableViewMode = this.toggleTableViewMode.bind(this);
        this.appendTableLine = this.appendTableLine.bind(this);
    }

    componentDidMount() {
        const component = this;

        const config = {
            method: "get",
            url: `Proposes/Take/${component.state.proposeId}`
        };

        axios(config)
            .then(function (response) {
                console.log(response.data);
                component.setState({
                    propose: response.data.propose,
                    currencies: response.data.currencies,
                    brands: response.data.brands,
                    lines: response.data.propose.lines ?? []
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

    updateCurrencies(date) {
        const component = this;

        const config = {
            method: "get",
            url: `Currencies/Values?date=${formatDate(date, "inputSmall")}&onlyPrimaries=true`
        };

        axios(config)
            .then(function (response) {
                component.setState({
                    currencies: response.data
                });

                component.calculateProductLines(component.state.lines);
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
        var stateLines = this.state.lines;

        switch (name) {
            case "currency.id":
                const currency = this.state.currencies.find(x => x.id === parseInt(value));
                statePropose.currency = currency;
                stateLines = this.calculateProductLines(stateLines);
                break;
            case "exrateDate":
                statePropose[name] = value;
                this.updateCurrencies(value);
                break;
            default:
                statePropose[name] = value ?? "";
                break;
        }
    
        this.setState({
            propose: statePropose,
            lines: stateLines
        });
    }    

    handleProposeTableChange(event) {
        const target = event.target;
        const parentId = target.type === "cSelect" ? event.parentId : target.closest("tr.tableWrapLine").dataset.parentId;
        const visualId = target.type === "cSelect" ? event.visualId : target.closest("tr.tableWrapLine").dataset.visualId;

        let value;

        switch (target.type) {
            case "checkbox":
                value = target.checked;
                break;
            case "number":
                value = target.step === "" || target.step === null ? parseInt(target.value) : parseFloat(target.value.replace(",", "."));
                break;
            default:
                value = target.value;
                break;
        }

        const name = target.name;

        var lines = this.state.lines;
        let line;
        
        if (parentId == null) {
            line = lines.find(x => x.visualId === visualId);            
        } else {
            var parentIds = parentId.split(",");
            let tempLines = lines;
            
            parentIds.forEach(id => {
                const child = tempLines.find(x => x.visualId === id);
                tempLines = child.children;
            });

            line = tempLines.find(x => x.visualId === visualId);
        }

        switch (line.type) {
            case 0:
                let proposeCurrPrice;
                let discountedPrice;
                let discountedPrice1;
                let discountedPrice2;
                switch (name) {
                    case "brand":
                        line.brand = value;
                        line.model = "";
                        line.productId = 0;
                        line.description = "";
                        line.unit = "ADET";
                        line.unitPrice = 0;
                        line.productPrice = 0;
                        line.priceCurrency = {};
                        line.productIsActive = null;
                        break;
                    case "model":
                        proposeCurrPrice = this.translateProductPrice(event.product.priceCurrency.id, event.product.price);
                        line.model = value;
                        line.productId = event.product.id;
                        line.description = event.product.description;
                        line.unit = event.product.unit;
                        line.unitPrice = parseFloat((proposeCurrPrice * (line.discountRate1 * line.discountRate2)).toFixed(2).replace(",", "."));
                        line.productPrice = event.product.price;
                        line.priceCurrency = event.product.priceCurrency;
                        line.productIsActive = event.product.isActive;
                        break;
                    case "discountRate1":
                    case "discountRate2":
                        proposeCurrPrice = this.translateProductPrice(line.priceCurrency.id, line.productPrice);

                        if (name === "discountRate1") {
                            line.discountRate1 = value;
                        } else if (name === "discountRate2") {                            
                            line.discountRate2 = value;
                        }

                        discountedPrice = proposeCurrPrice * line.discountRate1;
                        discountedPrice1 = proposeCurrPrice - discountedPrice;
                        discountedPrice2 = discountedPrice * (1 - line.discountRate2);

                        line.discountPrice1 = parseFloat(discountedPrice1.toFixed(2).replace(",", "."));
                        line.discountPrice2 = parseFloat(discountedPrice2.toFixed(2).replace(",", "."));
                        line.unitPrice = parseFloat((proposeCurrPrice - discountedPrice1 - discountedPrice2).toFixed(2).replace(",", "."));
                        break;
                    default:
                        line[name] = value;
                        break;
                }
                break;
            case 1:
            case 2:
            case 3:
            case 4:
                line[name] = value;
                break;
            default:
                alert("Geçersiz satır türü.");
                return;
        }
        
        this.setState({
            lines: lines
        });

        console.log(this.state.lines);
    }

    handleSubmit(event) {
        event.preventDefault();
        
        const component = this;

        const data = qs.stringify({
            propose: component.state.propose,
            lines: component.state.lines
        });

        const config = {
            method: 'post',
            url: 'Proposes/Edit',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                alert("Kayıt tamamlandı.");
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

    appendTableLine(event) {
        event.preventDefault();
        var type = parseInt(event.target.closest("button").dataset.type);
        var parentId = event.target.closest("button").dataset.parentId;

        var lines = this.state.lines;
        const createdDate = new Date();
        const randomNumber = Math.floor(Math.random() * 99999) + 10000;

        const newLine = {
            type: type,
            key: "",
            productId: 0,
            brand: "",
            model: "",
            description: "",
            qty: 1,
            unit: "ADET",
            unitPrice: 0,
            productPrice: 0,
            productIsActive: null,
            priceCurrency: {},
            discountRate1: 1,
            discountPrice1: 0,
            discountRate2: 1,
            discountPrice2: 0,
            isBrandDiscounted: false,
            color: "",
            visualId: `${type}-${formatDate(createdDate, "nochar")}-${randomNumber}`,
            createdDate: formatDate(createdDate),
            createdById: "",
            children: []
        }

        if (parentId == null) {
            switch (type) {
                case 1:
                    newLine.key = `${this.letters[lines.length]}.`;
                    break;
                case 0:
                    newLine.key = `${lines.length + 1}.`;
                    break;
                default:
                    alert("Geçersiz başlık türü.");
                    return;
            }

            lines.push(newLine);
        } else {
            var parentIds = parentId.split(",");
            var tempLines = lines;
            let tempParent;
            let tempLinesCount;
            
            parentIds.forEach(id => {
                const child = tempLines.find(x => x.visualId === id);
                const childIsCat = child.type === 3 || child.type === 4;
                if (!childIsCat) {                    
                    tempParent = child;
                    tempLinesCount = child.children.length;
                } else {
                    var childLinesCount = 0;

                    tempParent.children.forEach(x => {
                        childLinesCount += x.children.length;
                    });

                    tempLinesCount = childLinesCount;
                }
                tempLines = child.children;
            });

            newLine.key = (type === 3 || type === 4) ? "*" : `${tempParent.key}${tempLinesCount + 1}.`;
            tempLines.push(newLine);
        }

        this.setState({
            lines: lines
        });
    }

    toggleTableViewMode(event) {
        event.preventDefault();
        var mode = event.target.closest("button").dataset.viewMode;
        var colspan = this.state.tableColspan;
        var footerColspan = this.state.footerColspan;

        switch (mode) {
            case "lines":
                colspan = 8;
                footerColspan = 7;
                break;
            case "discs":
                colspan = 12;
                footerColspan = 5;
                break;
            case "maxim":
                colspan = 14;                
                footerColspan = 7;
                break;
            default:
                console.error("Geçersiz görünüm modu.");
                return;
        }
        
        this.setState({
            tableViewMode: mode,
            tableColspan: colspan,
            footerColspan: footerColspan
        });
    }

    render() {
        return (
            <>
                <PageHeader
                    title="TEKLİF DÜZENLE"
                    buttons={
                        [
                            {
                                href: "/admin/proposes",
                                text: "Teklifler",
                                icon: <i className="ft-list"></i>,
                                color: "secondary"
                            },
                            {
                                href: "/admin/proposes/add/",
                                text: "Teklif Ekle",
                                icon: <i className="ft-plus"></i>,
                                color: "success"
                            }
                        ]
                    } />
                
                <div className="content-body">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card rounded shadow">
                                <div className="card-header">
                                    <ul className="nav nav-tabs card-header-tabs" id="proposeTab" role="tablist">
                                        <li className="nav-item">
                                            <button type="button" className="nav-link" id="proposeHomeTab" data-bs-toggle="tab" data-bs-target="#proposeHome" role="tab" aria-controls="proposeHome" aria-selected="false">Anasayfa</button>
                                        </li>
                                        <li className="nav-item">
                                            <button type="button" className="nav-link" id="proposeSummaryTab" data-bs-toggle="tab" data-bs-target="#proposeSummary" role="tab" aria-controls="proposeSummary" aria-selected="false">Özet</button>
                                        </li>
                                        <li className="nav-item">
                                            <button type="button" className="nav-link active" id="proposeListTab" data-bs-toggle="tab" data-bs-target="#proposeList" role="tab" aria-controls="proposeList" aria-selected="true">Teklif</button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card-body">
                                    <div className="tab-content" id="proposeTabContent">
                                        <div className="tab-pane fade" id="proposeHome" role="tabpanel" aria-labelledby="proposeHomeTab">
                                            <form id="proposeForm" onSubmit={this.handleSubmit}>
                                                <div className="row mb-2">
                                                    <div className="col-md-12 d-flex justify-content-end">
                                                        <div className="btn-group btn-group-sm">
                                                            <button type="submit" className="btn btn-sm btn-primary"><UilSave /></button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    {/* name */}
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
                                                    {/* description */}
                                                    <div className="col-md-9">
                                                        <div className="form-group form-floating">
                                                            <textarea
                                                                id="proposeDescription"
                                                                className="form-control"
                                                                name="description"
                                                                value={this.state.propose.description ?? ""}
                                                                placeholder="Teklif Açıklaması"
                                                                maxLength="1000"
                                                                onChange={this.handleProposeChange}
                                                            ></textarea>
                                                            <label className="label-control" htmlFor="proposeDescription">Teklif Açıklaması</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    {/* customer */}
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
                                                    {/* company */}
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
                                                    {/* inCharge */}
                                                    <div className="col-md-3">
                                                        <div className="form-group form-floating">
                                                            <input
                                                                type="text"
                                                                id="proposeInCharge"
                                                                className="form-control"
                                                                name=""
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
                                                    {/* project */}
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
                                                    <div className="col-md-6">
                                                        <div className="row">
                                                            {/* startDate */}
                                                            <div className="col-md-4">
                                                                <div className="form-group form-floating">
                                                                    <input
                                                                        type="datetime-local"
                                                                        id="proposeStartDate"
                                                                        className="form-control"
                                                                        name="startDate"
                                                                        value={formatDate(this.state.propose.startDate)}
                                                                        placeholder="Baş. Tarihi"
                                                                        autoComplete="off"
                                                                        onChange={this.handleProposeChange}
                                                                        required />                                                    
                                                                    <label className="label-control" htmlFor="proposeStartDate">Baş. Tarihi</label>
                                                                </div>
                                                            </div>
                                                            {/* createdBy */}
                                                            <div className="col-md-4">
                                                                <div className="form-group form-floating">
                                                                    <input
                                                                        type="text"
                                                                        id="proposeCreatedBy"
                                                                        className="form-control"
                                                                        value={this.state.propose.createdBy.userName ?? ""}
                                                                        placeholder="Oluşturan"
                                                                        readOnly
                                                                        disabled />                                                    
                                                                    <label className="label-control" htmlFor="proposeCreatedBy">Oluşturan</label>
                                                                </div>
                                                            </div>
                                                            {/* createdDate */}
                                                            <div className="col-md-4">
                                                                <div className="form-group form-floating">
                                                                    <input
                                                                        type="datetime-local"
                                                                        id="proposeCreatedDate"
                                                                        className="form-control"
                                                                        value={formatDate(this.state.propose.createdDate)}
                                                                        placeholder="Oluşturulma"
                                                                        readOnly
                                                                        disabled />                                                    
                                                                    <label className="label-control" htmlFor="proposeCreatedDate">Oluşturulma</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <div className="col-md-3">
                                                        <div className="row">
                                                            {/* currency.id */}
                                                            <div className="col-md-6">
                                                                <div className="form-group form-floating">
                                                                    <select
                                                                        id="proposeCurrency"
                                                                        className="form-select"
                                                                        name="currency.id"
                                                                        autoComplete="off"
                                                                        value={this.state.propose.currency.id}
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
                                                            {/* exrateDate */}
                                                            <div className="col-md-6">
                                                                <div className="form-group form-floating">
                                                                    <input
                                                                        type="date"
                                                                        id="proposeExrateDate"
                                                                        className="form-control"
                                                                        name="exrateDate"
                                                                        value={formatDate(this.state.propose.exrateDate, "inputSmall")}
                                                                        max={formatDate(Date.now(), "inputSmall")}
                                                                        placeholder="Kur. Tarihi"
                                                                        autoComplete="off"
                                                                        onChange={this.handleProposeChange}
                                                                        required />                                                    
                                                                    <label className="label-control" htmlFor="proposeExrateDate">Kur. Tarihi</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* primaryCurrs */}
                                                    <div className="col-md-4">
                                                        <div className="row">
                                                            {
                                                                this.state.currencies && this.state.currencies.filter(x => x.code !== "TRY").map(curr =>
                                                                    <div key={_.uniqueId("primaryCurr-")} className="col-md-3">
                                                                        <div className="form-group form-floating">
                                                                            <input
                                                                                type="number"
                                                                                id={`proposePrimaryCurr-${curr.id}`}
                                                                                className="form-control"
                                                                                value={curr.value}
                                                                                placeholder={curr.code}
                                                                                readOnly
                                                                                disabled />                                                    
                                                                            <label className="label-control" htmlFor={`proposePrimaryCurr-${curr.id}`}>{curr.code}</label>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>                                        
                                            </form>
                                        </div>
                                        <div className="tab-pane fade" id="proposeSummary" role="tabpanel" aria-labelledby="proposeSummaryTab">
                                            <div id="proposeSummaryWrap" className="w-100 table-responsive-sm">
                                                <table id="proposeSummaryTable" className="table table-bordered align-middle">
                                                    <colgroup>
                                                        <col width="5%" />
                                                        <col width="64%" />
                                                        <col width="7%" />
                                                        <col width="12%" />
                                                        <col width="12%" />
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <th>S/N</th>
                                                            <th>Tanım</th>
                                                            <th>Adet</th>
                                                            <th>Birim Fiyat</th>
                                                            <th>Toplam Fiyat</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.state.lines && this.state.lines.filter(x => x.type === 1).map((x) => {
                                                                const mainTitleTotal = sumLineChildrenPrices(x.children);

                                                                return(
                                                                    <tr key={_.uniqueId("proposeSummaryLine-")}>
                                                                        <td>{x.key}</td>
                                                                        <td>{x.description}</td>
                                                                        <td>{x.qty}</td>
                                                                        <td className="text-end">
                                                                            <span className="float-start">{this.state.propose.currency.symbol}</span>
                                                                            {formatDecimal(mainTitleTotal)}
                                                                        </td>
                                                                        <td className="text-end">
                                                                            <span className="float-start">{this.state.propose.currency.symbol}</span>
                                                                            {formatDecimal(x.qty * parseFloat(mainTitleTotal.toFixed(2).replace(",", ".")))}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade show active" id="proposeList" role="tabpanel" aria-labelledby="proposeListTab">
                                            <div className="row mb-2">
                                                <div className="col-md-12 d-flex justify-content-end">
                                                    <div className="btn-group btn-group-sm">
                                                        <button type="button" className={`btn btn-sm btn-success${this.state.lines.filter(x => x.type === 0).length > 0 ? " d-none" : ""}`} title="Ana Başlık Ekle" data-type="1" onClick={this.appendTableLine}><UilPlus /></button>
                                                        <button type="button" className={`btn btn-sm btn-success${this.state.lines.filter(x => x.type === 1).length > 0 ? " d-none" : ""}`} title="Ürün Satırı Ekle" data-type="0" onClick={this.appendTableLine}><UilPlusSquare /></button>
                                                    </div>
                                                    <div className="btn-group btn-group-sm ms-2">
                                                        <button type="button" className="btn btn-sm btn-secondary" title="Satırlar" data-view-mode="lines" onClick={this.toggleTableViewMode}><UilListUl /></button>
                                                        <button type="button" className="btn btn-sm btn-secondary" title="İndirimler" data-view-mode="discs" onClick={this.toggleTableViewMode}><UilPercentage /></button>
                                                        <button type="button" className="btn btn-sm btn-secondary" title="Toplu" data-view-mode="maxim" onClick={this.toggleTableViewMode}><UilArrowsShrinkH /></button>
                                                    </div>
                                                    <div className="btn-group btn-group-sm ms-2">
                                                        <button type="button" className="btn btn-sm btn-primary" title="Tamamla (Yakında)" disabled><UilCheck /></button>
                                                        <button type="submit" form="proposeForm" className="btn btn-sm btn-primary" title="Kaydet"><UilSave /></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="proposeTableWrap" className="w-100 table-responsive-sm">
                                                <table id="proposeTable" className="table table-sm table-bordered align-middle">
                                                    <colgroup>
                                                        <col className="key" />
                                                        <col className="brand" />
                                                        <col className={`model ${(this.state.tableViewMode === "maxim" ? " liteWidth" : "")}`} />
                                                        <col className={`description ${(this.state.tableViewMode === "discs" ? " d-none" : "")}${(this.state.tableViewMode === "maxim" ? " liteWidth" : "")}`} />
                                                        <col className="qty" />
                                                        <col className={`unit lineEditCol${(this.state.tableViewMode === "discs" ? " d-none" : "")}`} />
                                                        <col className="unitPrice" />
                                                        <col className="totalPrice" />
                                                        <col className={`productPrice productEditCol${(this.state.tableViewMode === "lines" ? " d-none" : "")}`} />
                                                        <col className={`discountRate1 productEditCol${(this.state.tableViewMode === "lines" ? " d-none" : "")}`} />
                                                        <col className={`discountPrice1 productEditCol${(this.state.tableViewMode === "lines" ? " d-none" : "")}`} />
                                                        <col className={`discountRate2 productEditCol${(this.state.tableViewMode === "lines" ? " d-none" : "")}`} />
                                                        <col className={`discountPrice2 productEditCol${(this.state.tableViewMode === "lines" ? " d-none" : "")}`} />
                                                        <col className={`buttons productEditCol${(this.state.tableViewMode === "lines" ? " d-none" : "")}`} />
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <th className="key p-1">S/N</th>
                                                            <th className="brand p-1" data-content-tr="Marka" data-content-en="Brand">Marka</th>
                                                            <th className={`model p-1${(this.state.tableViewMode === "maxim" ? " liteWidth" : "")}`} data-content-tr="Model" data-content-en="Model">Model</th>
                                                            <th className={`description p-1 lineEditCol${(this.state.tableViewMode === "discs" ? " d-none" : "")}${(this.state.tableViewMode === "maxim" ? " liteWidth" : "")}`} data-content-tr="Malzemenin Tanımı" data-content-en="Description">Malzemenin Tanımı</th>
                                                            <th className="qty p-1" data-content-tr="Miktar" data-content-en="Qty">Miktar</th>
                                                            <th className={`unit p-1 lineEditCol${(this.state.tableViewMode === "discs" ? " d-none" : "")}`} data-content-tr="Birim" data-content-en="Unit">Birim</th>
                                                            <th className="unitPrice p-1" data-content-tr="Birim Fiyat" data-content-en="Unit Price">Birim Fiyat</th>
                                                            <th className="totalPrice p-1" data-content-tr="Toplam Fiyat" data-content-en="Total Price">Toplam Fiyat</th>
                                                            <th className={`productPrice p-1 productEditCol${(this.state.tableViewMode === "lines" ? " d-none" : "")}`}>Ürün Fiyatı</th>
                                                            <th className={`discountRate1 p-1 productEditCol${(this.state.tableViewMode === "lines" ? " d-none" : "")}`}>Çarpan 1</th>
                                                            <th className={`discountPrice1 p-1 productEditCol${(this.state.tableViewMode === "lines" ? " d-none" : "")}${(this.state.tableViewMode === "maxim" ? " liteWidth" : "")}`}>İnd. Tutarı 1</th>
                                                            <th className={`discountRate2 p-1 productEditCol${(this.state.tableViewMode === "lines" ? " d-none" : "")}`}>Çarpan 2</th>
                                                            <th className={`discountPrice2 p-1 productEditCol${(this.state.tableViewMode === "lines" ? " d-none" : "")}${(this.state.tableViewMode === "maxim" ? " liteWidth" : "")}`}>İnd. Tutarı 2</th>
                                                            <th className={`buttons p-1 productEditCol${(this.state.tableViewMode === "lines" ? " d-none" : "")}`}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.state.lines && this.state.lines.filter(x => x.type === 1).map(line =>
                                                                <MainTitle
                                                                    key={_.uniqueId("proposeMainTitle-")}
                                                                    data={line}
                                                                    propose={this.state.propose}
                                                                    currencies={this.state.currencies}
                                                                    appendTableLine={this.appendTableLine}
                                                                    handleProposeTableChange={this.handleProposeTableChange}
                                                                    colspan={this.state.tableColspan}
                                                                    brands={this.state.brands}
                                                                    tableViewMode={this.state.tableViewMode} />
                                                            )
                                                        }
                                                        {
                                                            this.state.lines && this.state.lines.filter(x => x.type === 0).map(line =>
                                                                <ProductLine
                                                                    key={_.uniqueId("proposeProductLine-")}
                                                                    data={line}
                                                                    propose={this.state.propose}
                                                                    currencies={this.state.currencies}
                                                                    handleProposeTableChange={this.handleProposeTableChange}
                                                                    brands={this.state.brands}
                                                                    tableViewMode={this.state.tableViewMode} />
                                                            )
                                                        }
                                                    </tbody>                                                    
                                                    <tfoot>
                                                        <tr>
                                                            <td colSpan={this.state.footerColspan} className="text-end">TEKLİF TOPLAMI: </td>
                                                            <td className="text-end"><span className="float-start">{this.state.propose.currency.symbol}</span>{formatDecimal(sumLineChildrenPrices(this.state.lines))}</td>
                                                            <td colSpan={this.state.tableColspan - (this.state.footerColspan + 1)} className={(this.state.tableColspan - (this.state.footerColspan + 1)) === 0 ? "d-none" : ""}></td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
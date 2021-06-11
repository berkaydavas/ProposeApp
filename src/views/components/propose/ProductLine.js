import { Component } from 'react'
import axios from 'axios'

import Select from 'react-select'
import TextareaAutosize from 'react-textarea-autosize';

import { formatDecimal } from '../../../helpers/helpers'

const customSelectStyles = {
    control: () => ({
        height: "25px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "nowrap"
    }),
    valueContainer: () => ({        
        display: "flex",
        flex: 1,
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        overflow: "hidden"
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        padding: "0"
    })
}

export default class ProductLine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            models: []
        }

        this.handleBrandChange = this.handleBrandChange.bind(this);
        this.handleModelChange = this.handleModelChange.bind(this);
    }

    componentDidMount() {
        const component = this;

        if (component.props.data.brand !== "") {
            const config = {
                method: "get",
                url: `Products/Take/Models?brand=${encodeURIComponent(component.props.data.brand)}`
            };
    
            axios(config)
                .then(function (response) {
                    component.setState({
                        models: response.data
                    });
                })
                .catch(function (err) {
                    if (err.response != null) {
                        alert(`Model listesi alınırken bir hata oluştu!\nHata Açıklaması: ${err.response.data.Message}`);
                    } else {
                        alert(`Model listesi alınırken bir hata oluştu!`);
                    }
                    console.error(err);
                });
        }
    }

    handleBrandChange(event) {
        const component = this;
        const htmlEvent = event;

        const config = {
            method: "get",
            url: `Products/Take/Models?brand=${encodeURIComponent(htmlEvent.target.value)}`
        };

        axios(config)
            .then(function (response) {
                component.setState({
                    models: response.data
                });

                component.props.handleProposeTableChange(htmlEvent);
            })
            .catch(function (err) {
                if (err.response != null) {
                    alert(`Model listesi alınırken bir hata oluştu!\nHata Açıklaması: ${err.response.data.Message}`);
                } else {
                    alert(`Model listesi alınırken bir hata oluştu!`);
                }
                console.error(err);
            });
    }

    handleModelChange(event) {
        const component = this;
        const htmlEvent = event;

        const config = {
            method: "get",
            url: `Products/Take?brand=${encodeURIComponent(component.props.data.brand)}&model=${encodeURIComponent(htmlEvent.target.value)}`
        };

        axios(config)
            .then(function (response) {
                var returnEvent = htmlEvent;
                returnEvent.product = {
                    id: response.data.id,
                    description: response.data.description,
                    unit: response.data.unit,
                    price: response.data.price,
                    priceCurrency: response.data.currency,
                    isActive: response.data.isActive
                }

                component.props.handleProposeTableChange(returnEvent);
            })
            .catch(function (err) {
                if (err.response != null) {
                    alert(`Model listesi alınırken bir hata oluştu!\nHata Açıklaması: ${err.response.data.Message}`);
                } else {
                    alert(`Model listesi alınırken bir hata oluştu!`);
                }
                console.error(err);
            });
    }

    render() {
        return (
            <tr className="tableWrapLine" data-parent-id={this.props.parentId} data-visual-id={this.props.data.visualId}>
                <td className="key p-1">
                    <input type="text" className="form-control form-control-sm" value={this.props.data.key} readOnly disabled />
                </td>
                <td className="brand p-1">
                    <Select
                        styles={customSelectStyles}
                        options={this.props.brands.map(x => { return { value: x, label: x } })}
                        value={this.props.data.brand === "" ? null : {
                            value: this.props.data.brand,
                            label: this.props.data.brand
                        }}
                        onChange={e => this.handleBrandChange({
                            target: {
                                name: "brand",
                                value: e.value,
                                type: "cSelect"
                            },
                            parentId: this.props.parentId,
                            visualId: this.props.data.visualId
                        })} />
                </td>
                <td className={`model p-1${(this.props.tableViewMode === "maxim" ? " liteWidth" : "")}`}>
                    <Select
                        styles={customSelectStyles}
                        options={this.state.models.map(x => { return { value: x, label: x } })}
                        value={this.props.data.model === "" ? null : {
                            value: this.props.data.model,
                            label: this.props.data.model
                        }}
                        onChange={e => this.handleModelChange({
                            target: {
                                name: "model",
                                value: e.value,
                                type: "cSelect"
                            },
                            parentId: this.props.parentId,
                            visualId: this.props.data.visualId
                        })} />
                </td>
                <td className={`description p-1 lineEditCol${(this.props.tableViewMode === "discs" ? " d-none" : "")}${(this.props.tableViewMode === "maxim" ? " liteWidth" : "")}`}>
                    <TextareaAutosize
                        maxRows="4"
                        className="form-control form-control-sm"
                        name="description"
                        value={this.props.data.description}
                        onChange={this.props.handleProposeTableChange} />
                </td>
                <td className="qty p-1">
                    <input type="number" className="form-control form-control-sm" min="0" name="qty" value={this.props.data.qty} onChange={this.props.handleProposeTableChange} />
                </td>
                <td className={`unit p-1 lineEditCol${(this.props.tableViewMode === "discs" ? " d-none" : "")}`}>
                    <select className="form-select form-select-sm" name="unit" value={this.props.data.unit} onChange={this.props.handleProposeTableChange}>
                        <option>ADET</option>
                        <option>METRE</option>
                        <option>SET</option>
                    </select>
                </td>
                <td className="unitPrice p-1">
                    <div className="input-group input-group-sm">
                        <span className="input-group-text px-1">{this.props.propose.currency.symbol}</span>
                        <input type="number" className="form-control form-control-sm text-end" step="0.01" min="0" name="unitPrice" value={this.props.data.unitPrice} readOnly disabled />
                    </div>
                </td>
                <td className="totalPrice text-end p-1">
                    <span className="float-start">{this.props.propose.currency.symbol}</span>{formatDecimal(this.props.data.qty * this.props.data.unitPrice)}
                </td>
                <td className={`productPrice text-end p-1 productEditCol${(this.props.tableViewMode === "lines" ? " d-none" : "")}`}>
                    <span className="float-start">{this.props.data.priceCurrency?.symbol}</span>{formatDecimal(this.props.data.productPrice)}
                </td>
                <td className={`discountRate1 p-1 productEditCol${(this.props.tableViewMode === "lines" ? " d-none" : "")}`}>
                    <div className="input-group input-group-sm">
                        <input type="number" className="form-control form-control-sm" step="0.0001" name="discountRate1" value={this.props.data.discountRate1} onChange={this.props.handleProposeTableChange} />
                        <span className="input-group-text px-1">%{formatDecimal((1 - this.props.data.discountRate1) * 100, 1)}</span>
                    </div>
                </td>
                <td className={`discountPrice1 p-1 productEditCol${(this.props.tableViewMode === "lines" ? " d-none" : "")}`}>
                    <div className="input-group input-group-sm">
                        <span className="input-group-text px-1">{this.props.propose.currency.symbol}</span>
                        <input type="number" className="form-control form-control-sm text-end" step="0.01" name="discountPrice1" value={this.props.data.discountPrice1} readOnly disabled />
                    </div>
                </td>
                <td className={`discountRate2 p-1 productEditCol${(this.props.tableViewMode === "lines" ? " d-none" : "")}`}>
                    <div className="input-group input-group-sm">
                        <input type="number" className="form-control form-control-sm" step="0.0001" name="discountRate2" value={this.props.data.discountRate2} onChange={this.props.handleProposeTableChange} />
                        <span className="input-group-text px-1">%{formatDecimal((1 - this.props.data.discountRate2) * 100, 1)}</span>
                    </div>
                </td>
                <td className={`discountPrice2 p-1 productEditCol${(this.props.tableViewMode === "lines" ? " d-none" : "")}`}>
                    <div className="input-group input-group-sm">
                        <span className="input-group-text px-1">{this.props.propose.currency.symbol}</span>
                        <input type="number" className="form-control form-control-sm text-end" step="0.01" name="discountPrice2" value={this.props.data.discountPrice2} readOnly disabled />
                    </div>
                </td>
                <td className={`buttons productEditCol${(this.props.tableViewMode === "lines" ? " d-none" : "")}`}></td>
            </tr>
        );
    }
}
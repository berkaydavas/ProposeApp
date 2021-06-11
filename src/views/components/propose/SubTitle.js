import { Component } from 'react'
import _ from 'lodash'
import { UilPlus } from '@iconscout/react-unicons'

import CatLine from './CatLine'
import ProductLine from './ProductLine'

import { formatDecimal, sumLineChildrenPrices } from '../../../helpers/helpers'

export default class SubTitle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasCatLine: this.props.data.children && this.props.data.children.filter(x => x.type === 4).length > 0,
            hasProductLine: this.props.data.children && this.props.data.children.filter(x => x.type === 0).length > 0
        }

        let footerColspan;

        switch (this.props.tableViewMode) {
            case "lines":
                footerColspan = this.props.colspan - 1;
                break;
            case "discs":
                footerColspan = 5;
                break;
            case "maxim":
                footerColspan = 7;
                break;
            default:
                alert("Geçersiz görünüm modu.");
                return;
        }

        this.footerColspan = footerColspan;
    }

    render() {
        return (
            <tr className="tableWrapLine" data-parent-id={this.props.parentId} data-visual-id={this.props.data.visualId}>
                <td colSpan={this.props.colspan} className="p-0">
                    <table className="table table-sm table-bordered table-responsive-sm subTitleTable mb-1 align-middle">
                        <colgroup>
                            <col className="key" />
                            <col className="brand" />
                            <col className={`model ${(this.props.tableViewMode === "maxim" ? " liteWidth" : "")}`} />
                            <col className={`description ${(this.props.tableViewMode === "discs" ? " d-none" : "")}${(this.props.tableViewMode === "maxim" ? " liteWidth" : "")}`} />
                            <col className="qty" />
                            <col className={`unit lineEditCol${(this.props.tableViewMode === "discs" ? " d-none" : "")}`} />
                            <col className="unitPrice" />
                            <col className="totalPrice" />
                            <col className={`productPrice productEditCol${(this.props.tableViewMode === "lines" ? " d-none" : "")}`} />
                            <col className={`discountRate1 productEditCol${(this.props.tableViewMode === "lines" ? " d-none" : "")}`} />
                            <col className={`discountPrice1 productEditCol${(this.props.tableViewMode === "lines" ? " d-none" : "")}`} />
                            <col className={`discountRate2 productEditCol${(this.props.tableViewMode === "lines" ? " d-none" : "")}`} />
                            <col className={`discountPrice2 productEditCol${(this.props.tableViewMode === "lines" ? " d-none" : "")}`} />
                            <col className={`buttons productEditCol${(this.props.tableViewMode === "lines" ? " d-none" : "")}`} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="key p-1">
                                    <input type="text" className="form-control form-control-sm" value={this.props.data.key} readOnly disabled />
                                </th>
                                <th className="titleDescription p-1" colSpan={this.props.colspan - 1}>
                                    <div className="d-flex justift-content-between">
                                        <div className="me-auto w-100 pe-3">
                                            <input
                                                type="text"
                                                className="form-control form-control-sm w-100"
                                                name="description"
                                                autoComplete="off"
                                                value={this.props.data.description ?? ""}
                                                onChange={this.props.handleProposeTableChange} />
                                        </div>
                                        <div className="btn-group btn-group-sm flex-shrink-0">
                                            <button type="button" className={`btn btn-sm btn-outline-danger${this.state.hasProductLine ? " d-none" : ""}`} data-type="4" data-parent-id={`${this.props.parentId},${this.props.data.visualId}`} onClick={this.props.appendTableLine}><UilPlus size="13" /> Kategori</button>
                                            <button type="button" className={`btn btn-sm btn-outline-secondary${this.state.hasCatLine ? " d-none" : ""}`} data-type="0" data-parent-id={`${this.props.parentId},${this.props.data.visualId}`} onClick={this.props.appendTableLine}><UilPlus size="13" /> Boş Ürün</button>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>                    
                            {
                                this.props.data.children && this.props.data.children.filter(x => x.type === 4).map(line =>
                                    <CatLine
                                        key={_.uniqueId("proposeCatLine-")}
                                        data={line}
                                        colspan={this.props.colspan}
                                        brands={this.props.brands}
                                        propose={this.props.propose}
                                        currencies={this.props.currencies}
                                        parentId={`${this.props.parentId},${this.props.data.visualId}`}
                                        appendTableLine={this.props.appendTableLine}
                                        handleProposeTableChange={this.props.handleProposeTableChange}
                                        tableViewMode={this.props.tableViewMode} />
                                )
                            }
                            {
                                this.props.data.children && this.props.data.children.filter(x => x.type === 0).map(line =>
                                    <ProductLine
                                        key={_.uniqueId("proposeSubTitleProductLine-")}
                                        data={line}
                                        propose={this.props.propose}
                                        currencies={this.props.currencies}
                                        handleProposeTableChange={this.props.handleProposeTableChange}
                                        brands={this.props.brands}
                                        parentId={`${this.props.parentId},${this.props.data.visualId}`}
                                        tableViewMode={this.props.tableViewMode} />
                                )
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={this.footerColspan} className="text-end">{this.props.data.description} TOPLAMI: </td>
                                <td className="text-end"><span className="float-start">{this.props.propose.currency.symbol}</span>{formatDecimal(sumLineChildrenPrices(this.props.data.children))}</td>
                                <td colSpan={this.props.colspan - (this.footerColspan + 1)} className={(this.props.colspan - (this.footerColspan + 1)) === 0 ? "d-none" : ""}></td>
                            </tr>
                        </tfoot>
                    </table>
                </td>
            </tr>
        );
    }
}
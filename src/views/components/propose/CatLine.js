import { Component } from 'react'
import _ from 'lodash'
import { UilPlus } from '@iconscout/react-unicons'

import ProductLine from './ProductLine'

export default class CatLine extends Component {
    render() {
        return (
            <tr className="tableWrapLine" data-parent-id={this.props.parentId} data-visual-id={this.props.data.visualId}>
                <td colSpan={this.props.colspan} className="p-0">
                    <table className="table table-sm table-bordered table-responsive-sm catLineTable mb-1 align-middle">
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
                                            <button type="button" className={`btn btn-sm btn-outline-secondary`} data-type="0" data-parent-id={`${this.props.parentId},${this.props.data.visualId}`} onClick={this.props.appendTableLine}><UilPlus size="13" /> Boş Ürün</button>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.data.children && this.props.data.children.filter(x => x.type === 0).map(line =>
                                    <ProductLine
                                        key={_.uniqueId("proposeCatLineProductLine-")}
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
                    </table>
                </td>
            </tr>
        );
    }
}
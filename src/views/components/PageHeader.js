import { Component } from 'react';
import { Link } from "react-router-dom";

import _ from 'lodash'

export default class PageHeader extends Component {
    render() {
        return (
            <>
                <div className="content-header row mb-3 align-items-center">
                    <div className="content-header-left col-md-6 col-12">
                        <h3 className="content-header-title mb-0">
                            {this.props.title}
                        </h3>
                    </div>
                    <div className="content-header-right col-md-6 col-12 d-flex justify-content-end">
                        <div className="btn-group btn-group-sm">
                            {
                                this.props.buttons && this.props.buttons.map(x =>
                                    <Link key={_.uniqueId("pageHeadButton-")} to={x.href} className={`btn btn-sm btn-${x.color}`}>{x.icon} {x.text}</Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
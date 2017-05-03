import React from 'react';
import './Esop.scss';

import paperContract from '../images/contract.png';

import EmployeeList from '../components/EmployeeList'
import EmployeeAdd from '../components/EmployeeAdd'
import EmployeeListDetails from '../components/EmployeeListDetails'
import EmployeeDetails from '../components/EmployeeDetails'
import ContractAddresses from '../components/ContractAddresses'
import ContractStatus from '../components/ContractStatus'
import ConversionStatus from '../components/ConversionStatus'
import ContractParameters from '../components/ContractParameters'
import ConvertOptions from '../components/ConvertOptions'

import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';

export default class Esop extends React.Component {

    constructor(props) {
        super(props);
        this.store = props.store;
        this.services = props.services;

        this.state = {
            esop_desc_open: false,
            paper_contract_open: false
        };
    }

    componentDidMount() {
        this.unsubscribe = this.store.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleEsopDescOpen = () => {
        this.setState({esop_desc_open: true});
    };

    handleEsopDescClose = () => {
        this.setState({esop_desc_open: false});
    };

    handlePaperContractOpen = () => {
        this.setState({paper_contract_open: true});
    };

    handlePaperContractClose = () => {
        this.setState({paper_contract_open: false});
    };

    render() {
        let userState = this.store.getState().user;
        let ESOPState = this.store.getState().ESOP;
        let UIState = this.store.getState().UI;

        const actions = [
            <IconButton tooltip="Download">
                <FontIcon className="material-icons">file_download</FontIcon>
            </IconButton>,
            <IconButton tooltip="Print">
                <FontIcon className="material-icons">print</FontIcon>
            </IconButton>,
        ];

        return (
            <div className="row">
                <div className="col-xs-12 col-md-10 col-md-offset-1">
                    <div className="esop">

                        <div className="row">
                            <div className="col-xs-12 col-md-3">
                                <h1>Neufund’s ESOP overview</h1>
                            </div>
                            <div className="col-xs-12 col-md-7 read_more">
                                <RaisedButton className="read_more_button" label="Read more what ESOP is"
                                              onTouchTap={this.handleEsopDescOpen}/>
                            </div>
                        </div>

                        {(userState.userType == 'employee') &&
                            <EmployeeDetails services={this.services} store={this.store}/>
                        }

                        <ContractStatus contractState={ESOPState}/>

                        {ESOPState.conversionOfferedAt != 0 &&
                        <ConversionStatus contractState={ESOPState}/>
                        }
                        <ContractAddresses RoTAddress={ESOPState.RoTAddress} ESOPAddress={ESOPState.ESOPAddress}/>
                        <ContractParameters contractParameters={ESOPState} isCEO={userState.userType == "ceo"} onClickTap={this.handlePaperContractOpen}/>

                        <div className="row">
                            <div className="col-xs-12">
                                <h2>Employees:</h2>
                            </div>
                        </div>

                        {userState.userType === "ceo" &&
                        <EmployeeAdd services={this.services} store={this.store}/>
                        }

                        <div className="row">
                            <div className="col-xs-12">
                                <EmployeeList store={this.store}/>
                            </div>
                        </div>

                        {(UIState.selectedUser !== undefined) &&
                        <div className="row">
                            <div className="col-xs-12 ">
                                <EmployeeListDetails store={this.store} services={this.services}/>
                            </div>
                        </div>
                        }

                        {(userState.userType === "ceo" && ESOPState.esopState ===1 && false) &&
                            <ConvertOptions store={this.store} services={this.services}/>
                        }

                        <Dialog
                            modal={false}
                            open={this.state.esop_desc_open}
                            onRequestClose={this.handleEsopDescClose}
                        >
                            <h2>What is ESOP and why we do it?</h2>
                            <p>ESOP stands for Employees Stock Options Plan. Many companies decide to include employees
                                in company's success by offering them shares. Shares are typically available in form of
                                options (mostly due to tax reasons) and are converted directly into cash when company
                                has an IPO or gets acquired. There is a lot of interesting reasoning behind various ESOP
                                structures and opinions when it works and when not. Here is a nice introduction: <a
                                    href="https://www.accion.org/sites/default/files/Accion%20Venture%20Lab%20-%20ESOP%20Best%20Practices.pdf">https://www.accion.org/sites/default/files/Accion%20Venture%20Lab%20-%20ESOP%20Best%20Practices.pdf</a>
                            </p>
                            <p>Neufund eats its own food and offers employees ESOP via a smart contract where options
                                are represented as Ethereum tokens. Employees are still provided with ESOP terms in
                                readable English (we call it <em>legal wrapper</em>) which is generated from before
                                mentioned smart contract. Such construct replaces paper agreement employee signs and
                                adds many interesting things on top.</p>
                            <ol>
                                <li>Process of assigning options, vesting and converting are immutable and transparent
                                    (including rules on changing rules). Trustless trust is to large degree provided.
                                </li>
                                <li>It is enforceable in off-chain court like standard paper agreement, <em>however</em>
                                    as smart contracts are self-enforcing a need for legal action should be negligible.
                                </li>
                                <li>Typical criticism of ESOP is that you need to wait till the exit or IPO to get your
                                    shares and money. This is too long for being a real incentive. <strong>This is not
                                        the case with tokenized options.</strong> Use of Ethereum token extends
                                    opportunities to profit from options. For example <strong>you can convert them into
                                        ERC20 compliant tokens when company is doing its ICO</strong> or <strong>make
                                        options directly trade-able</strong> (via migration mechanism described later).
                                </li>
                                <li>Smart contracts are self-enforcing and do all calculations and bookkeeping. They are
                                    very cheap once written and tested. ESOP d-app UI (<a
                                        href="https://github.com/Neufund/ESOP-ui">https://github.com/Neufund/ESOP-ui</a>)
                                    is easy to deploy with minimal maintenance costs.
                                </li>
                            </ol>

                        </Dialog>

                        <Dialog
                            modal={false}
                            open={this.state.paper_contract_open}
                            onRequestClose={this.handlePaperContractClose}
                            actions={actions}
                        >
                            <h2>Paper contract</h2>
                            <div>
                                <img className="paper_contract_img" src={paperContract}/>
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        )
    }
};
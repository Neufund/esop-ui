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
                                <h1>Neufund ESOP details</h1>
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

                        {userState.userType == "ceo" &&
                        <EmployeeAdd services={this.services} store={this.store}/>
                        }

                        <div className="row">
                            <div className="col-xs-12">
                                <EmployeeList store={this.store}/>
                            </div>
                        </div>

                        {(UIState.selectedUser != undefined) &&
                        <div className="row">
                            <div className="col-xs-12 ">
                                <EmployeeListDetails store={this.store} services={this.services}/>
                            </div>
                        </div>
                        }

                        {(userState.userType == "ceo" && ESOPState.esopState == 1 && false) &&
                            <ConvertOptions store={this.store} services={this.services}/>
                        }

                        <Dialog
                            modal={false}
                            open={this.state.esop_desc_open}
                            onRequestClose={this.handleEsopDescClose}
                        >
                            <h2>Short introduction</h2>
                            <p>So generally it should be something short with link to our github page where user will
                                find long
                                detailed description</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Audax negotium, dicerem
                                impudens, nisi
                                hoc institutum postea translatum ad philosophos nostros esset. Igitur ne dolorem
                                quidem.</p>
                            <p>Mihi enim satis est, ipsis non satis. Duo Reges: constructio interrete. Deinde disputat,
                                quod
                                cuiusque generis animantium statui deceat extremum. Indicant pueri, in quibus ut in
                                speculis
                                natura cernitur. Qui non moveatur et offensione turpitudinis et comprobatione
                                honestatis? Ait
                                enim se, si uratur, Quam hoc suave! dicturum. Urgent tamen et nihil remittunt. An hoc
                                usque
                                quaque, aliter in vita? Ille vero, si insipiens-quo certe, quoniam tyrannus -, numquam
                                beatus;
                                Quis non odit sordidos, vanos, leves, futtiles?</p>
                            <p>Progredientibus autem aetatibus sensim tardeve potius quasi nosmet ipsos cognoscimus.
                                Quam illa
                                ardentis amores excitaret sui! Cur tandem? Hoc est non modo cor non habere, sed ne
                                palatum
                                quidem. At iste non dolendi status non vocatur voluptas. Ratio quidem vestra sic cogit.
                                Videsne
                                quam sit magna dissensio? Qui igitur convenit ab alia voluptate dicere naturam
                                proficisci, in
                                alia summum bonum ponere? Quamquam id quidem licebit iis existimare, qui legerint.</p>

                            <p><a target="_blank" href="https://github.com/Neufund/ESOP">This is link click me</a></p>
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
import React from 'react';
import './Esop.scss';

import chart from '../images/esop_chart.jpg';
import paperContract from '../images/contract.png';

import EmployeeList from '../components/EmployeeList'
import EmployeeAdd from '../components/EmployeeAdd'
import EmployeeListDetails from '../components/EmployeeListDetails'
import EmployeeDetails from '../components/EmployeeDetails'
import ContractAddresses from '../components/ContractAddresses'
import ContractState from '../components/ContractState'
import ContractParameters from '../components/ContractParameters'

import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import {Tabs, Tab} from 'material-ui/Tabs';
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

        let selectedUser;

        if(userState.userType == "ceo")
            selectedUser = UIState.selectedUser;
        else if (userState.userType == "employee")
            selectedUser = userState.userPK;

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

                        <ContractAddresses RoTAddress={ESOPState.RoTAddress}
                                           ESOPAddress={ESOPState.ESOPAddress}
                                           EmployeesListAddress={ESOPState.EmployeesListAddress}
                                           OptionsCalculatorAddress={ESOPState.OptionsCalculatorAddress}
                                           OptionsConverterAddress="0x0000000000000000000000000000000000000000"/>

                        <ContractState contractState={ESOPState}/>

                        <div className="row">
                            <div className="col-xs-12">
                                <h2>Contract parameters:</h2>
                            </div>
                        </div>

                        <div className="row">
                            <Tabs>
                                <Tab label="Parameters">
                                    <ContractParameters contractParameters={ESOPState}
                                                        onClickTap={this.handlePaperContractOpen}/>
                                </Tab>
                                <Tab label="Visualisation">
                                    <div className="col-xs-12">
                                        <img className="contract_chart" src={chart}/>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>

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

                        {(userState.userType == "ceo" && selectedUser != undefined) &&
                        <div className="row">
                            <div className="col-xs-12 ">
                                <EmployeeListDetails selectedUser={selectedUser} store={this.store}/>
                            </div>
                        </div>
                        }

                        {userState.userType == "ceo" &&
                        <div className="row">
                            <div className="col-xs-12 convert_options">
                                <h2>Convert options:</h2>
                                <TextField floatingLabelText="Convert options contract address"
                                           style={{width: "32.000rem"}}/>
                                <br />
                                <RaisedButton className="read_more_button" label="Convert options"
                                              onTouchTap={() => alert("This will close ESOP and convert options")}/>
                            </div>
                        </div>
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
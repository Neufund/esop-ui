import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'

export default class ConvertOptions extends React.Component {

    constructor(props) {
        super(props);
        this.store = props.store;
        this.services = props.services;

        this.state = {}
    }

    componentDidMount() {
        this.unsubscribe = this.store.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleConvertButton = () => {
        let optionsConverterAddress = this.state.OptionsConverterAddress;

        this.store.dispatch({
            type: "SHOW_CONFIRM_TRANSACTION_DIALOG",
            confirmTransactionDialog: true
        });

        this.services.ESOPService.offerOptionsConversion(optionsConverterAddress).then(
            success => {
                this.services.ESOPService.getESOPDataFromContract();
                this.services.ESOPService.obtainContractAddresses();
                this.store.dispatch({
                    type: "SHOW_CONFIRM_TRANSACTION_DIALOG",
                    confirmTransactionDialog: false
                });
            },
            error => {
                this.store.dispatch({
                    type: "SHOW_CONFIRM_TRANSACTION_DIALOG",
                    confirmTransactionDialog: false
                });

                this.store.dispatch({
                    type: "SHOW_ERROR_DIALOG",
                    errorDialog: true
                });
                console.log(error);
            }
        );
    };

    render() {
        return (
            <div className="row">
                <div className="col-xs-12" style={{marginBottom: "2em"}}>
                    <h2>Convert options:</h2>
                    <TextField floatingLabelText="Options converter contract address" style={{width: "32.000rem"}}
                    onChange={(event, newValue) => this.setState({OptionsConverterAddress: newValue})}/>
                    <br />
                    <RaisedButton label="Convert options" onTouchTap={this.handleConvertButton}/>
                </div>
            </div>
        )
    }

}
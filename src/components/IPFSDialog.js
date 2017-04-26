import React from 'react';
import './Header.scss';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

export default ({showDocumentDialog,handleDialogRequestClose ,handlePrint ,LegalDocument }) => {

    const standardActions = (
        <div>
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={handleDialogRequestClose}
            />
            <FlatButton
                label="PDF"
                primary={true}
            />
            <FlatButton
                label="Print"
                primary={true}
                onTouchTap={handlePrint}
            />
        </div>
    );

    return (
        <Dialog
            open={showDocumentDialog}
            title="Legal Document"
            actions={standardActions}
            onRequestClose={handleDialogRequestClose}
            autoScrollBodyContent={true}
        >
            <div id="ifmcontentstoprint" dangerouslySetInnerHTML={{__html:LegalDocument}}></div>

        </Dialog>
    )
}
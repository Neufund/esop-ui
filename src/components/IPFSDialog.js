import React from 'react';
import './IPFSDialog.scss';
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

export default ({showDocumentDialog ,handleDialogRequestClose ,handlePrint ,title , documentHtml}) => {


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
            title={title}
            actions={standardActions}
            onRequestClose={handleDialogRequestClose}
            autoScrollBodyContent={true}
        >
            <div id="ifmcontentstoprint" dangerouslySetInnerHTML={{ __html : documentHtml}}></div>
        </Dialog>
    )
}
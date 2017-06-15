import React from 'react';
import './IPFSDialog.scss';
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {downloadFile} from '../utils'
import Config from '../config'

class IFrame extends React.Component{

    componentDidMount() {
        const content= this.props.content;
        let doc = document.getElementById('ifmcontentstoprint').contentWindow.document;
        doc.open();
        doc.write(content);
        doc.close()
    }

    componentDidUpdate() {
        this.updateIFrameContents();
    }

    render() {
        return <iframe
            id="ifmcontentstoprint"
            ref="frame"
            width={this.props.width}
            height={this.props.height}
        >

        </iframe>;
    }
}

export default ({showDocumentDialog, handleDialogRequestClose, handlePrint, title, documentHtml, ipfsHash, employeeData}) => {
    function downloadPDF() {
        downloadFile(ipfsHash, employeeData)
    }

    const standardActions = [
        <FlatButton
            label="Close"
            primary={true}
            onTouchTap={handleDialogRequestClose}
        />,
        <FlatButton
            label="Print"
            primary={true}
            onTouchTap={handlePrint}
        />,
    ];

    if(Config.pdfRenderServer !== '') {
        standardActions.push(<FlatButton
            label="Download PDF"
            primary={true}
            onTouchTap={downloadPDF}/>)
    }

    return (
        <Dialog
            open={showDocumentDialog}
            title={title}
            actions={standardActions}
            onRequestClose={handleDialogRequestClose}
            autoScrollBodyContent={true}
        >
            <IFrame content={documentHtml}/>
        </Dialog>
    )
}

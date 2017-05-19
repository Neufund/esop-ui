import React from 'react';
import './IPFSDialog.scss';
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {downloadFile} from '../utils'

class IFrame extends React.Component{

    componentDidMount() {
        const content= this.props.content
        let doc = document.getElementById('ifmcontentstoprint').contentWindow.document
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



export default ({IPFSDialog, showDocumentDialog, handleDialogRequestClose, handlePrint, title, documentHtml}) => {
    function downloadPDF() {
        downloadFile(ipfsHash)
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
        <FlatButton
            label="Download PDF"
            primary={true}
            onTouchTap={downloadPDF}
        />
    ];
    
    function componentDidMount() {
        console.log("mounted")
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
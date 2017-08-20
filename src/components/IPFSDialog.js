import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import './IPFSDialog.scss';
import { downloadFile } from '../utils';
import Config from '../config';

class IFrame extends React.Component {
  componentDidMount() {
    const content = this.props.content;
    const doc = document.getElementById('ifmcontentstoprint').contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();
  }

  componentDidUpdate() {
    this.updateIFrameContents();
  }

  render() {
    return (<iframe
      id="ifmcontentstoprint"
      ref="frame"
      width={this.props.width}
      height={this.props.height}
    />);
  }
}

export default ({ showDocumentDialog, handleDialogRequestClose, title, documentHtml, ipfsHash,
  employeeData }) => {
  function downloadPDF() {
    downloadFile(ipfsHash, employeeData);
  }
  function handlePrint() {
    // console.log(document.getElementById("ifmcontentstoprint").contentWindow.document.);
    const mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write(`<html><head><title>${document.title}</title>`);
    mywindow.document.write(document.getElementById('ifmcontentstoprint').contentWindow.document.head.innerHTML);
    mywindow.document.write('</head><body >');
    mywindow.document.write(document.getElementById('ifmcontentstoprint').contentWindow.document.body.innerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();
  }

  const standardActions = [
    <FlatButton
      label="Close"
      primary
      onTouchTap={handleDialogRequestClose}
    />,
    <FlatButton
      label="Print"
      primary
      onTouchTap={handlePrint}
    />,
  ];

  if (Config.pdfRenderServer !== '') {
    standardActions.push(<FlatButton
      label="Download PDF"
      primary
      onTouchTap={downloadPDF}
    />);
  }

  return (
    <Dialog
      open={showDocumentDialog}
      title={title}
      actions={standardActions}
      onRequestClose={handleDialogRequestClose}
      autoScrollBodyContent
    >
      <IFrame content={documentHtml} />
    </Dialog>
  );
};

import React from 'react';
import './Header.scss';

export default ({userPK, userType}) => {
    return (
        <div>
            <div className="row">
                <div className="col-xs-12 col-md-10 col-md-offset-1">
                    <div className="header">
                        Employee Stock Option Plan (ESOP) manager
                    </div>
                </div>
            </div>

            {userType === "anonymous" &&
            <div className="row introduction">
                <div className="col-xs-12 col-md-10 col-md-offset-1">

                    <div className="row">
                        <div className="col-xs-12">
                            <p>Neufund is making its vision come true and offers ESOP via a smart contract where options are represented as Ethereum tokens.</p>
                            <p>We put it on Blockchain because:</p>
                            <ol>
                                <li>Process of managing options is immutable and transparent with the goal of providing trustless trust <a href="http://banciur.org">(read more about the concept)</a></li>
                                <li>Smart contracts are enforceable in off-chain court like standard paper agreement</li>
                                <li>Since monetising standard ESOP is rarely executable before company's exit or IPO, instant tokenizing options and enabling their tradability can function as real incentive for employees. <a href="http://banciur.org">(for more read here)</a>.</li>
                                <li>Smart contracts are self-enforcing and do all calculations and bookkeeping for you. Once you’ve written them, they are very cheap to maintain.</li>
                            </ol>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-4">
                            <div className="introduction_column_header">
                                <i className="material-icons">mode_edit</i>
                            </div>
                            <div>
                                <p>If you are Neufund employee or CEO you can log in with Ledger NANO S or Metamask. As a Contract Owner you will be able to add employees and manage their plan. As an Employee you will be able to confirm the ownership of your stock and sign the contract.</p>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="introduction_column_header">
                                <i className="material-icons">build</i>
                            </div>
                            <div>
                                <p>If you want to build your employee stock option plan based on Neufund’s solution <a href="https://github.com/Neufund/ESOP">go to GitHub</a>. Neufund ESOP smart contract is open sourced and available to anyone on the MIT license. Instructions are provided on the GitHub page, if you have any questions go to <a href="https://neufundorg.signup.team/">Slack</a> or <a href="https://gitter.im/Neufund">Gitter</a>.</p>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="introduction_column_header">
                                <i className="material-icons">remove_red_eye</i>
                            </div>
                            <div>
                                <p>If you are interested in the legal side of the idea of tokenizing options read our <a href="http://banciur.org">Medium Post</a>.</p>
                                <p>If you are interested on the detailed rules governing the contract go to <a href="http://banciur.org">Github</a>.</p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <p>*As for today Neufund ESOP is deployed on testnet.</p>
                        </div>
                    </div>
                </div>
            </div>
            }

            <div className="row">
                <div className="col-xs-12 col-md-10 col-md-offset-1">
                    {userPK !== undefined &&
                    <div>
                        <p>Hello, you provided us with address: <b>{userPK}</b></p>
                        {userType === "anonymous" ?
                            <p>If you are Neufund employee, please pass address above to us to be included in ESOP.</p>
                            :
                            <p>Your position: {userType}</p>
                        }
                    </div>
                    }
                </div>
            </ div>
        </ div>
    )
}
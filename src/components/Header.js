import React from 'react';
import './Header.scss';
import ContractUtils from '../ContractUtils'
import {getUserTypeName} from '../utils'

export default ({userPK, userType, networkId}) => {
    return (
        <div className="header">
            <div className="row">
                <div className="col-xs-12 col-md-10 col-md-offset-1 logo_section">
                    <div className="logo"></div>
                    <div className="title">
                        Employee Stock Option Plan Manager <span className="smaller">[on: {ContractUtils.getNetworkName(networkId)}]</span>
                    </div>
                    {userType === "anonymous" &&
                    <div className="goTo"><a href="#esop_dapp">Go to DAPP</a></div>
                    }
                </div>
            </div>

            {userType === "anonymous" &&
            <div className="introduction">
                <div className="row center-md greeting">
                    <div className="text col-xs-12 col-md-6">
                        <h2>Welcome to ESOP manager</h2>
                        <p>Neufund’s mission is to establish an active secondary market for startup equity, through providing a solution to represent startup shares as Blockchain tokens. <span className="bold">This works also for non-Blockchain projects (e.g AI, biotech, hardware etc.)</span> To demonstrate to the Blockchain community that our concept has practical potential, we have converted the 10% pool of Neufund stock reserved for the employees into Ethereum tokens, and have provided a smart contract to govern it in place of a legal agreement. Now any incorporated startup can use our solution to implement their ESOP on Blockchain.</p>
                    </div>
                    <div className="image_wrapper col-xs-0 col-md-3">
                        <div className="image"></div>
                    </div>
                </div>
                <div className="row center-md columns">
                    <div className="col-xs-12 col-md-9">
                        <div className="row">
                            <div className="col-xs-12 col-sm-4 col_first">
                                <p className="column_title">For Neufund team</p>
                                <p className="column_text">Neufund Employees and Contract Managers (e.g. CEO) can log in with Ledger NANO S or Metamask. Contract Manager can add employees and manage their stock options plan. Employees can confirm the ownership of the stock granted and sign the contract with the Ledger NANO S.</p>
                            </div>
                            <div className="col-xs-12 col-sm-4 col_middle">
                                <p className="column_title">For other startups</p>
                                <p className="column_text">If you want to build your employee stock option plan based on Neufund’s solution <a href="https://github.com/Neufund/ESOP">go to GitHub</a>. Neufund ESOP smart contract is open sourced and available to anyone on the MIT license. Instructions are provided on the GitHub page, if you have any questions go to <a href="https://neufundorg.signup.team/">Slack</a>  or <a href="https://gitter.im/Neufund">Gitter</a>.</p>
                            </div>
                            <div className="col-xs-12 col-sm-4 col_last">
                                <p className="column_title">For others</p>
                                <p className="column_text">ESOPs are complex mechanisms, but also a great method to make employees participate in the startup’s upside. ESOPs can be improved even more by tokenization. Read more about ESOPs and option-tokens in our <a target="_blank" href="https://blog.neufund.org/tokenizing-startup-equity-part-1-employee-incentive-options-plan-esop-on-ethereum-blockchain-dce2416f4505">Medium Post</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row center-md content">
                    <div className="round_logo_wrapper col-xs-0 col-xs-offset-0 col-md-3" >
                        <div className="round_logo"></div>
                    </div>
                    <div className="col-xs-12 col-md-6 content_text">
                        <p><span className="bold">For startups there is a number of upshots to implementing an ESOP on Blockchain: *</span></p>
                        <p>There is a certain opaqueness surrounding option grants and their potential value.  Most startup employees do not have enough information to properly evaluate the offer they receive, nor compare it against industry benchmarks. This can be mitigated by employers granting and managing options on Blockchain, in an <span className="bold">immutable and transparent</span> smart contract and providing trustless trust <a href="http://insights.instech.london/post/102dw0w/trustless-trust-a-brief-explanation">(read more about the concept)</a>.</p>
                        <p>Today many startup employees see options as a bonus that may or may not arrive, at a potential exit in 5-10 years. This is a quite intangible incentive accessible only in a very long time horizon, which is why employees often completely ignore stock options when evaluating a job offer. In Neufund’s concept the tokenized ESOP allows for a liquid asset position if the company issuing the ESOP either permits trading of vested options on Blockchain exchanges (like Kraken or Poloniex), or lets the employees convert their options into other tradable tokens in an ICO. This creates a secondary option-token market from which both employers and employees benefit greatly - <span className="bold">employees would likely be a lot more incentivized by options which they could monetize within a shorter time</span> (e.g. 1-2 years).</p>
                        <p>Smart contracts enforce the performance of the ESOP agreement between the employer and employee, and make contractual clause unnecessary. This makes the management and maintenance of often very complicated ESOP algorithms <span className="bold">a lot easier and cheaper for the startup, and a lot more trustworthy for the employees</span>. In our concept, however, the employees are additionally protected by legal clause, enforceable through standard legal proceedings and court orders, in case smart contract or Ethereum Blockchain fails. The templates for this are also provided in our solution for any startup to use.</p>
                        <p>*As for today Neufund ESOP is deployed on testnet.</p>
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
                            <p>Your position: <b>{getUserTypeName(userType)}</b></p>
                        }
                    </div>
                    }
                </div>
            </ div>
        </ div>
    )
}
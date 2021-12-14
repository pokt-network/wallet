import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import GlobalStyles from './components/global-style';

import MaintenanceView from './views/maintenance/index';
// import Home from './views/home/index';
// import Send from './views/send/index';
// import Create from './views/create/index';
// import LogOut from './views/log-out/index';
// import AccountLatest from './views/account-detail/index';
// import ImportPocket from './views/import-pocket/index';
// import TransactionDetail from './views/transaction-detail/index';
// import Header from "./components/header";
import Footer from "./components/footer";
import history from './history';
import './normalize.css';
import JSBI from 'jsbi';

class App extends Component {
  constructor(props) {
    super(props)
    // BigInt polyfill for iOS devices
    if (window.BigInt === undefined) {
      window.BigInt = JSBI.BigInt;
    }
  }

  render() {
    return (
        <Router history={history}>
            <div className="loader-container" id="loader">
                <div className="loader"></div>
            </div>
            <div className="page-container">
                <GlobalStyles />
                {/* <Header /> */}
                <Route exact path="/" component={MaintenanceView}></Route>
                <Footer />
            </div>
        </Router>
    )
  }
}

export default App;

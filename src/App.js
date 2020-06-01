import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import GlobalStyles from './components/global-style';

import Home from './views/home/index';
import BuyPokt from './views/buy-pokt/index';
import Send from './views/send/index';
import Create from './views/create/index';
import CreatePrivateKey from './views/create-private-key/index';
import LogOut from './views/log-out/index';
import AccountLatest from './views/account-latest/index';
import ImportPocket from './views/import-pocket/index';
import TransactionDetail from './views/transaction-detail/index';
import Import from './views/import/index.js';
import Header from "./components/header";
import Footer from "./components/footer";

import './normalize.css';

class App extends Component {
  render() {
    console.log("Rendering app")
    return (
        <Router>
            <div className="page-container">
                <GlobalStyles />
                <Header />
                <Route exact path="/" component={Home}></Route>
                <Route exact path="/buypokt" component={BuyPokt}></Route>
                <Route exact path="/send" component={Send}></Route>
                <Route exact path="/create" component={Create}></Route>
                <Route exact path="/createprivatekey" component={CreatePrivateKey}></Route>
                <Route exact path="/logout" component={LogOut}></Route>
                <Route exact path="/import" component={ImportPocket}></Route>
                {/* <Route exact path='/import' component={Import}></Route> */}
                <Route exact path="/account" component={AccountLatest}></Route>
                <Route exact path="/transaction-detail" component={TransactionDetail}></Route>
                <Footer />
            </div>
        </Router>
    )
  }
}

export default App;
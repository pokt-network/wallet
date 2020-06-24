import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import GlobalStyles from './components/global-style';

import Home from './views/home/index';
import Send from './views/send/index';
import Create from './views/create/index';
import LogOut from './views/log-out/index';
import AccountLatest from './views/account-detail/index';
import ImportPocket from './views/import-pocket/index';
import TransactionDetail from './views/transaction-detail/index';
import Header from "./components/header";
import Footer from "./components/footer";
import history from './history';
import {DataSource} from "./datasource";
import './normalize.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.dataSource = DataSource.instance
    this.dataSource.getPocketInstance()

  }

  render() {
    return (
        <Router history={history}>
            <div className="loader-container" id="loader">
                <div className="loader"></div>
            </div>
            <div className="page-container">
                <GlobalStyles />
                <Header />
                <Route exact path="/" component={Home}></Route>
                <Route exact path="/send" component={Send}></Route>
                <Route exact path="/create" component={Create}></Route>
                <Route exact path="/logout" component={LogOut}></Route>
                <Route exact path="/import" component={ImportPocket}></Route>
                <Route exact path="/account" component={AccountLatest}></Route>
                <Route exact path="/transaction-detail" component={TransactionDetail}></Route>
                <Footer />
            </div>
        </Router>
    )
  }
}

export default App;
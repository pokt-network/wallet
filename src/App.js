import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { css } from "styled-components";
import { createGlobalStyle } from 'styled-components';
import { maxPhone } from "./utils/media";

import Home from './views/home/index';
import BuyPokt from './views/buy-pokt/index';
import Send from './views/send/index';
import Create from './views/create/index';
import CreatePrivateKey from './views/create-private-key/index';
import LogOut from './views/log-out/index';
import Import from './views/import/index';
import Header from "./components/header";
import Footer from "./components/footer";

import './normalize.css';

const GlobalStyles = createGlobalStyle`
  body {
    @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700,900');
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap');
    font-family: 'Lato', sans-serif;
  }
  .page-container {
    background-image: linear-gradient(126deg, #27a9e0 19%, #092e40 94%, #06202e 100%);
    ${maxPhone(css`
      background-image: linear-gradient(161deg, #27a9e0 -3%, #092e40 93%, #06202e 100%);
    `)};
  }
  .error {
    display: block;
    margin-top: 1px;
    color: #fa5849;
    font-size: 14px;
    font-weight: 300;
    margin-right: 17px;
    text-align: right;
    ${maxPhone(css`
      margin-right: 10px;
    `)};
    img {
      max-width: 12px;
      margin-right: -2px;
    }
  }
`

class App extends Component {
  render() {
    return (
      <Router>
          <div className="page-container">
            <GlobalStyles />
            <Header />
            <Route exact path='/' component={Home}></Route>
            <Route exact path='/buypokt' component={BuyPokt}></Route>
            <Route exact path='/send' component={Send}></Route>
            <Route exact path='/create' component={Create}></Route>
            <Route exact path='/createprivatekey' component={CreatePrivateKey}></Route>
            <Route exact path='/logout' component={LogOut}></Route>
            <Route exact path='/import' component={Import}></Route>
            <Footer />
          </div>
      </Router>
    );
  }
}

export default App;
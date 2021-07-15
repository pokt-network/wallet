import { createGlobalStyle, css } from "styled-components";
import { maxPhone } from "../utils/media";

const GlobalStyles = createGlobalStyle`
  body {
    font-family: 'Lato', sans-serif;
  }
  .page-container {
    background-image: linear-gradient(126deg, #27a9e0 19%, #092e40 94%, #06202e 100%);
    ${maxPhone(css`
        background-image: linear-gradient(
            161deg,
            #27a9e0 -3%,
            #092e40 93%,
            #06202e 100%
        );
    `)};
  }
  .loader-container {
    position: fixed;
    display: none; 
    width: 100%; 
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 99999999;
  }
  .loader {
    position: absolute;
    top: 30%;
    left: calc(50% - 50px);
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #27A9E0; /* Blue */
    border-radius: 50%;
    width: 90px;
    height: 90px;
    animation: spin 2s linear infinite;
  }
  .copy-button {
    background-color: #F5F5F5;
    display: inline-block;
    position: absolute;
    margin-left: -40px;
    padding: 0px 0px 0px 4px;
    margin-top: 9px;
    cursor: pointer;
    img {
      display: inline-block;
      height: 22px;
      width: 22px;
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
  .popup-content {
    max-width: 535px;
    padding: 0 !important;
    border-radius: 12px;
    box-shadow: 0 43px 39px -40px rgba(0, 0, 0, 0.5);
    background-image: linear-gradient(to bottom, #fbfbfb, #f5f5f5);
    ${maxPhone(css`
        max-width: 96%;
        width: 96% !important;
    `)};
  }
`;

export default GlobalStyles;

import React from 'react';
import EmptyWrapper from '../../components/emptywrapper';
import {
    withRouter
} from 'react-router-dom'

function LogOut (){
    return (
        <EmptyWrapper>
            <h1>Log Out</h1>
        </EmptyWrapper>
    );
}

export default withRouter(LogOut);
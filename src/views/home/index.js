import React from 'react';
import HomeContent from './home';
import Landing from '../../components/landing';
import {
    withRouter
} from 'react-router-dom'

function Home (){
    return (
        <HomeContent>
            <Landing />
        </HomeContent>
    );
}

export default withRouter(Home);
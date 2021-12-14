import React from 'react';
import MaintenanceContent from './maintenance';
import MaintenanceLanding from '../../components/landing/maintenance';
import {
    withRouter
} from 'react-router-dom'

function Maintenance (){
    return (
        <MaintenanceContent>
            <MaintenanceLanding />
        </MaintenanceContent>
    );
}

export default withRouter(Maintenance);
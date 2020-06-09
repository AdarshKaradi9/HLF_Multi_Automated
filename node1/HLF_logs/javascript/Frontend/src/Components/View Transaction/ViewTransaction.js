import React from 'react';
import LogsList from '../LogsList/LogsList';
import Admin from '../Admin/Admin';
import {Jumbotron} from 'react-bootstrap';

const ViewTransaction = ({isTransactionData,transactionData,currentUser}) => {
    console.log('from view',currentUser)
    if(isTransactionData) {
        if(currentUser==='admin') {
            return(
                <Jumbotron>
                    <Admin transactionData={transactionData} />  
                </Jumbotron>
            ); 
        }
        else {
            return(
                <Jumbotron>
                    <LogsList transactionData={transactionData} />  
                </Jumbotron>
            ); 
        }
       
    } else 
    {
        return (
            <div></div>
        )
    }
    
}

export default ViewTransaction;

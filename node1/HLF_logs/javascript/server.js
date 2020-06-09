/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const Joi = require('joi');
const express = require('express');
const cors = require('cors');
const app = express();
let network = require('./network.js');
var CircularJSON = require('circular-json');
app.use(express.json());
app.use(cors());


const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const ccpPath = path.resolve(__dirname, '..', '..','connection-org1.json');


const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);



async function main() {
    var signedInUsers = [];
    var currentUser = '';
    var pass='';
    var secret = '';
    try {
        async function signIn() {
            let networkObj = await network.connectToNetwork(arguments[0])
            if (networkObj.error) {
                res.send(networkObj);
            }
            var index = signedInUsers.indexOf(arguments[0]);
            if(index > -1) {
                console.log(`${arguments[0]} already signed in`);
                return 2;
            } else {
                console.log(`${arguments[0]} signed in`)
                return 1;
            }
        }

        async function signOut() {
            console.log(`${currentUser} signed out`);
            var index = signedInUsers.indexOf(currentUser);
            if (index > -1) {
                signedInUsers.splice(index, 1);
            }
            currentUser = '';
        }

        app.get('/',(req,res) => {
            res.send('This is root');
        });

        app.post('/register',async function(req,res) {
            var userId = req.body.username;
            var type=req.body.type;
            let response = await network.registerUser(userId,type);
            console.log('response from registerUser: ');
            console.log(response);
            if (response.error) {
                res.send(response.error);
            } else {
                let networkObj = await network.connectToNetwork(userId);
                if (networkObj.error) {
                res.send(networkObj.error);
                }
                let args = [JSON.stringify(req.body)];
                console.log('before invoke')
                let invokeResponse = await network.invoke(networkObj, false, 'createUser',args);
                console.log("after");
                if (invokeResponse.error) {
                res.send(invokeResponse.error);
                } else {

                console.log('after network.invoke ');
                var response1 = {
                    data: userId,
                    resStatus: 'success'
                }
                res.json(response1);
        }
        }
        });
        
        app.get('/viewTransaction',async function(req,res) {
            console.log('from view',currentUser)
            let networkObj = await network.connectToNetwork(currentUser);
            let response = await network.invoke(networkObj, true, 'queryLog', currentUser);
            let parsedResponse = await JSON.parse(response);
            console.log(parsedResponse);
            res.send(parsedResponse);
        });

        app.post('/signin',async function(req,res) {
            var userId = req.body.username;
            var stat=await signIn(userId);
            pass=req.body.password;
            console.log(stat);
            if(stat==1) {
                currentUser=userId;
                signedInUsers.push(currentUser);
		    var response_sign = {
                    userName: currentUser,
                    resStatus: 'success'
                }
                res.json(response_sign)
            }else if(stat==0) {
                console.log("h");
                res.status(400).json(`User "${userId}" does not exists!!!\nPlease register first!!`)
            }else if(stat==2) {
                res.status(400).json(`User "${userId}" already logged in!!!`)
            }
        });

        app.get('/signout', async function(req, res) {
            await signOut();
            res.json("Signed out");
        });
       
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

app.listen(3001, () => {
    console.log('server is running on port 3001')
})

main();


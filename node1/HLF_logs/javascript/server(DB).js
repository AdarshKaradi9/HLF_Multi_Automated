/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const Joi = require('joi');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt')
const app = express();
const saltRounds = 10;
const knex = require('knex')({
    client: 'pg',
    version: '12.1',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '0000',
      database : 'login'
    }
  });


app.use(express.json());
app.use(cors());

const db = knex;


const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');


const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);



async function main() {
    var signedInUsers = [];
    var currentUser = '';
    var secret = '';
    try {

        async function register() {
            try {        
                const userExists = await wallet.exists(arguments[0]);
		        console.log(arguments[0]);
                if (userExists) {
                    console.log(`An identity for the user ${arguments[0]} already exists in the wallet`);
                    return 0;
                }
                const adminExists = await wallet.exists('admin');
                if (!adminExists) {
                    console.log('An identity for the admin user "admin" does not exist in the wallet');
                    console.log('Run the enrollAdmin.js application before retrying');
                    return 0;
                }
                const gateway = new Gateway();
                await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });
        
                const ca = gateway.getClient().getCertificateAuthority();
                const adminIdentity = gateway.getCurrentIdentity();
                
                secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: arguments[0], role: 'client' }, adminIdentity);``
                const enrollment = await ca.enroll({ enrollmentID: arguments[0], enrollmentSecret: secret });
                const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
                await wallet.import(arguments[0], userIdentity);
                console.log(`Successfully registered ${arguments[0]} and imported it into the wallet`);
                return 1;
            } catch (error) {
                console.error(`Failed to register user ${arguments[0]}: ${error}`);
                return 0;
            }
        }

        async function authorize() {
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(currentUser);
            if (!userExists) {
                console.log('An identity for the user does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccpPath, { wallet, identity: currentUser, discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('logchain');
            return contract;
        }

        async function signIn() {
            const userExists = await wallet.exists(arguments[0]);
                if (!userExists) {
                    return 0;
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
            
        async function getTransaction(){
            const result = await arguments[1].evaluateTransaction('queryLog',arguments[0]);
            const r = JSON.parse(result);
            return r;

        }

        async function getAllTransactions(){
            const result = await arguments[0].evaluateTransaction('queryAllLogs');
            const r = JSON.parse(result);
            return r;
        }

        app.get('/',(req,res) => {
            res.send('This is root');
        });

        app.post('/register',async function(req,res) {
            console.log("HERE");
            var hash = bcrypt.hashSync(req.body.password, saltRounds);
            db('username').insert([{username:`{${req.body.username}}` , secret:`${hash}`}],['username'])
            .then(data => {
                console.log(data)})
            .catch(err => {
                console.log(err)
                res.status(400).send("ERROR WITH REG")
            })
            
            var temp = req.body.username;
            console.log(req.body)
            var regstat = await register(temp);
            var response = {};
            if(regstat==0) {
                res.json(`Failed to register : User "${temp}" already exists`)
            }else {
                response = {
                    secretKey: secret,
                    resStatus: 'success'
                }
                res.json(response);
                }
        
                      
        });
        
        app.get('/viewTransaction',async function(req,res) {
            console.log('from view',currentUser)
            const cont = await authorize();
            const result1 = await getAllTransactions(cont); 
            res.json(result1);
            
        });

        app.get('/viewTransaction/:tid',async function(req,res) {
            console.log(currentUser)
            const cont = await authorize();
            const tid = req.params.tid;
            const result1 = await getTransaction(tid,cont); 
            res.send(result1);
        });

        app.post('/signin',async function(req,res) {
            var temp = req.body.username;
            console.log(req.body.password);
            var stat=await signIn(temp);
            console.log(req.body)
            
            db('username').select('*').where('username','=',`{${req.body.username}}`)
            .then(data => {
                console.log(data)
                const valid = bcrypt.compareSync(req.body.password, data[0].secret);
		console.log(valid);
                var response = {};
                console.log(valid);
                if(valid){
                        console.log(temp);
                    if(stat==1) {
                        currentUser=temp;
                        signedInUsers.push(currentUser);
                        response = {
                            userName: currentUser,
                            resStatus: 'success'
                        }
                        res.json(response);
                    }else if(stat==0) {
                        console.log("h");
                        res.status(400).json(`User "${temp}" does not exists!!!\nPlease register first!!`)
                    }else if(stat==2) {
                        res.status(400).json(`User "${temp}" already logged in!!!`)
                    }
                }
                else{
                    res.status(400).send('unable to login')
                }
        })
        .catch( err => {
            console.log(err)
            res.status(400).json('Something wrong with UserName')
        })

    });

    app.get('/signout', async function(req, res) {
            await signOut();
            res.json("Signed out");
            console.log("SIGNOUT");
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

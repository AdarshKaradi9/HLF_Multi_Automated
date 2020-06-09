let network = require('./network.js');
var CircularJSON = require('circular-json');
const { Gateway, Wallets } = require('fabric-network');
const { FileSystemWallet, X509WalletMixin }=require('fabric-network');
const path = require('path');
const fs = require('fs');
async function main() {
    let networkObj = await network.connectToNetwork('admin');
    let adminId=CircularJSON.stringify(networkObj.gateway.currentIdentity)
    let args=[adminId]
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    var identity = await wallet.get('admin');
    console.log(identity);
    // console.log(networkObj.gateway.currentIdentity._identity)
    // let response = network.invoke(networkObj, false, 'initAdmin',args);
    // if (response.error) {
    //     console.log(response.error);
    // } else {
    //     console.log("admin initilized");
    // }
}
main();

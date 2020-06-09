let network = require('./network.js');
var user=process.argv[2]
async function main() {
    var userid = await network.connectToNetwork(user);
    console.log('connected to user1');
    var logsArr = 
        {
            ram: 8,
            os: 'windows',
            load: 91,
            autoscale: 1
        };
    var args= {
        uid:user,
        logs:logsArr
    };
    console.log(typeof(args.logs.load))
    args=[JSON.stringify(args)]
    
    let response = await network.invoke(userid, false, 'addLogs',args);
    console.log('chain',response);
    if (response.error) {
        console.log(response.error);
    } else {
        console.log("admin initilized");
    }
}
main();


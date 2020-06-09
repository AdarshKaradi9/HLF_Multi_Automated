/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
class LogChain extends Contract {
    async initLedger(ctx) {
      console.info('============= START : Initialize Ledger ===========');
      // TYPE 0 50% 100:GOLD, 1 70% 50:SILVER, 2 90% 25:BRONZE
      const global =
          {
            len:1,
            logs:[
              {
                tid:1,
                uid:'init',
                ram: 8,
                os: 'windows',
                load: 40,
                autoscale: 0
              },
            ],
          }

      await ctx.stub.putState('admin', Buffer.from(JSON.stringify(global)));
      console.info('============= END : Initialize Ledger ===========');
    }

    async createUser(ctx, username, type) {
        console.info('============= START : Create Log ===========');
        // args= JSON.parse(args);
        let logs=[];
        let compensationNoTimes=0;
        let compensationValue=0;
        let threshold=0;
        let uid=username;
        type=parseInt(type);
        if(type==0) {//gold
          compensationValue=100
          threshold=50
        }
        else if(type==1) {//silver
          compensationValue=75
          threshold=75
        }
        else {//bronze
          compensationValue=50
          threshold=90
        }
        const user = {
          uid,
          logs,
          type,
          compensationNoTimes,
          compensationValue,
          threshold,
      };
        await ctx.stub.putState(uid,Buffer.from(JSON.stringify(user)));
        console.info('============= END : Create Log ===========');
    }

    async queryLog(ctx, uid) {
      const logAsBytes = await ctx.stub.getState(uid); // get the Log from chaincode state
      if (!logAsBytes || logAsBytes.length === 0) {
          throw new Error(`${uid} does not exist`);
      }
      console.log(logAsBytes.toString());
      return logAsBytes.toString();
  }

    async addLogs(ctx,uid,ram,os,load,autoscale) {
      // args=JSON.parse(args);
      // var log=args.logs;
      const userAsBytes = await ctx.stub.getState(uid);
      if (!userAsBytes || userAsBytes.length === 0) {
        throw new Error(`${uid} does not exist`);
      } 
      const globalLogs = await ctx.stub.getState('admin');
      if (!globalLogs || globalLogs.length === 0) {
        throw new Error(`admin does not exist`);
      }
      const global = JSON.parse(globalLogs.toString());
      const user = JSON.parse(userAsBytes.toString());

      var log= {
        tid:global.len+1,
        ram:Number(ram),
        os:Number(os),
        load:Number(load),
        autoscale:Number(autoscale)
      }
      if(Number(load)>user.threshold && Number(autoscale)==1) {
        user.logs.push(log);
        await ctx.stub.putState(uid, Buffer.from(JSON.stringify(user)));
      }
      log['uid']=uid
      global.logs.push(log);
      global.len=global.len+1
      await ctx.stub.putState('admin', Buffer.from(JSON.stringify(global)));
    }
}

module.exports = LogChain;



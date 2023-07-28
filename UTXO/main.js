const Blockchain = require('./BlockChain');

// import newBlockchain from "./BlockChain";

// 示例用法
bc = Blockchain.newBlockchain();
// bc = BlockchainModule.newBlockchain();
bc.addBlock("Send 1");
bc.addBlock("Send 2");


for(let i=0;i<bc.blocks.length;i++){
    console.log(bc.blocks[i].hash);
}


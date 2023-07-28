const crypto = require('crypto');
const Pow = require('./pow')

class Block {
    constructor(timestamp, data, prevBlockHash, hash, nonce) {
    this.timestamp = timestamp;//时间戳
    this.data = data;//数据
    this.prevBlockHash = prevBlockHash;//前一块的hash
    this.hash = hash;//当前的hash
    this.nonce = nonce
        }

    setHash() {
        //设置hash,时间戳转换为时间戳的字符串。
        const timestamp = this.timestamp.toString();
        //前块hash + data + 时间戳联合在一起
        const headers = Buffer.concat([this.prevBlockHash, Buffer.from(this.data), Buffer.from(timestamp)]);
        // 计算本块hash值
        const hash = crypto.createHash('sha256').update(headers).digest();
        this.hash = hash;
        }
    }

function newBlock(data, prevBlockHash) {
    //通过交易信息和前块hash新建区块。
    const timestamp = Math.round(new Date().getTime() / 1000);
    const block = new Block(timestamp, data, prevBlockHash, Buffer.alloc(0),0);
    block.setHash();
    // newPow = Pow.NewProofOfWork(block);
    // resutlt = Pow.run(newPow);
    // block.nonce = resutlt[0]
    // block.hash = resutlt[1]

    
    return block; 
}


function newGenesisBlock() {
    return newBlock("Genesis Block", Buffer.alloc(0));
}


class Blockchain {
    constructor(GenesisBlock) {
        this.blocks = [GenesisBlock];
    }
    addBlock(data) {
        const prevBlock = this.blocks[this.blocks.length - 1];
        const block = newBlock(data, prevBlock.hash);
        this.blocks.push(block);
    }
  }


function newBlockchain() {
    return new Blockchain(newGenesisBlock());
}


  

module.exports = {
    newBlockchain,
    Block
};


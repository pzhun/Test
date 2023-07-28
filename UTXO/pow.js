const crypto = require('crypto');
const BigInt = require('big-integer');
const Blockchain = require('./BlockChain');
const maxNonce = Number.MAX_SAFE_INTEGER; //循环上限
const targetBits = 24;//挖矿难度




class ProofOfWork {  //pow结构
    constructor(block) {
        this.block = block;
        this.target = BigInt(2 ** (256 - targetBits));
    }
}

function NewProofOfWork(block) { //创建pow
    const target = BigInt(1).shiftLeft(256 - targetBits);
    const pow = new ProofOfWork(block, target);
    return pow;
}

function int2Hex(num) {
  const buffer = Buffer.alloc(8); // 创建一个长度为 8 字节的 Buffer
  buffer.writeBigInt64BE(num); // 将 int64 类型的整数写入 Buffer
  return buffer;
}
// const headers = Buffer.concat([this.prevBlockHash, Buffer.from(this.data), Buffer.from(timestamp)]);

function prepareData(pow, nonce) { //准备数据 
  console.log(pow.block.PrevBlockHash)

    const data = Buffer.concat([
        pow.block.PrevBlockHash,
        pow.block.Data
        // int2Hex(pow.block.Timestamp),
        // int2Hex(targetBits),
        // int2Hex(nonce),
    ]);
  
    return data;
  }
  

function run(pow) { //运行挖矿
    const hashInt = BigInt();
    let hash;
    let nonce = 0;
  
    console.log(`Mining the block containing ${pow.block.Data}, maxNonce=${maxNonce}`);
    while (nonce < maxNonce) {
      // 数据准备
      const data = prepareData(pow,nonce);
      // 计算哈希
      hash = crypto.createHash('sha256').update(data).digest();
      process.stdout.write(hash.toString('hex'));
      hashInt.fromBuffer(hash);
      // 按字节比较，hashInt.compare() 小于 0 代表找到目标 Nonce
      if (hashInt.compare(pow.target) === -1) {
        break;
      } else {
        nonce++;
      }
    }
    console.log('\n\n');
    return [nonce, hash];
  }  


function Validate(pow) {  //校验hash是否符合挖矿难度
    const data = pow.prepareData(pow.block.Nonce);
    const hash = crypto.createHash('sha256').update(data).digest();
    const hashInt = BigInt(`0x${hash.toString('hex')}`);
    return hashInt < pow.target;
}


module.exports = {
    NewProofOfWork,
    run
};
class TXInput{
    constructor(Txid,VoutIdx,FromAddr){
        this.Txid = Txid; //引用交易ID
        this.VoutIdx = VoutIdx; //交易输出编号
        this.FromAddr = FromAddr; //输入放验签
    }
}

class TXOutput{
    constructor(Value,ToAddr){
        this.Value = Value; //输出金额
        this.ToAddr = ToAddr; //收方验签
    }
}

class Transaction{
    constructor(ID,Vin,Vout){
        this.ID = ID; //交易Id
        this.Vin = Vin; //交易输入
        this.Vout = Vout; //交易输出
    }
}


function SetID(tx) {
    const encoded = Buffer.alloc(0);
    const enc = new (require('stream').Writable)();
    enc._write = (chunk, encoding, next) => {
      encoded = Buffer.concat([encoded, chunk]);
      next();
    };
    enc.on('finish', () => {
      const hash = crypto.createHash('sha256').update(encoded).digest();
      tx.ID = hash;
    });
  
    const encoder = require('gob').NewEncoder(enc);
    encoder.encode(tx);
    enc.end();
}

function CanUnlockOutputWith(inData, unlockingData) {
    return inData.FromAddr === unlockingData;
}

function CanBeUnlockedWith(outData, unlockingData) {
    return outData.ToAddr === unlockingData;
}
  
function NewUTXOTransaction(from, to, amount, bc) {
    // 1. 组合输入项和输出项
    let inputs = [];
    let outputs = [];
  
    // 2. 查询最小UTXO
    let { acc, validOutputs } = bc.FindSpendableOutputs(from, amount);
    if (acc < amount) {
      console.log("ERROR: Not enough funds");
      return null;
    }
  
    // 3. 构建输入项
    for (let txid in validOutputs) {
      let txID = Buffer.from(txid, 'hex');
  
      for (let out of validOutputs[txid]) {
        let input = { txID, out, from };
        inputs.push(input);
      }
    }
  
    // 4. 构建输出项
    outputs.push({ amount, to });
  
    // 需要找零
    if (acc > amount) {
      outputs.push({ amount: acc - amount, to: from }); // a change
    }
  
    // 5. 交易生成
    let tx = { ID: null, Inputs: inputs, Outputs: outputs };
    SetID(tx);
  
    return tx;
  }
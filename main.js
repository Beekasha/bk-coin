const SHA256 = require('crypto-js/sha256');

class Block{
	constructor(index, timestamp, data, previousHash = ''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash(){
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
	}

	mineBlock(difficulty){
		// begins the hash with difficulty amount of zeros
		while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join('0')){
			this.nonce++;
			this.hash = this.calculateHash();
		}

		console.log(`Block mined: ${this.hash}`)
	}
}

class Blockchain{
	constructor(){
		this.chain = [this.createGenesisBlock()];
		// increasing the difficulty will increase the amount of time needed to create a new block
		this.difficulty = 4;
	}

	createGenesisBlock(){
		return new Block(0, '01/01/2021', "Genesis block", "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty)
		this.chain.push(newBlock);
	}

	isChainValid(){
		for(let i=1; i<this.chain.length; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i-1];

			if((currentBlock.hash !== currentBlock.calculateHash()) || (currentBlock.previousHash !== previousBlock.hash)) {
				return false;
			}
		}
		return true;
	}
}

let bkCoin = new Blockchain();

console.log("Mining Block 1...")
bkCoin.addBlock(new Block(1, '01/03/2021', { amount: 4 }));

console.log("Mining Block 2...")
bkCoin.addBlock(new Block(2, '01/06/2021', { amount: 10 }));

// testing validity of isChainValid() after trying to tamper with the chain
// console.log(`Is blockchain valid? ${bkCoin.isChainValid()}`);
// bkCoin.chain[1].data = { amount: 8000 };
// console.log(`Is blockchain valid after trying to tamper? ${bkCoin.isChainValid()}`);


// stringify with 4 spaces - makes it more readable
// console.log(JSON.stringify(bkCoin, null, 4)); 
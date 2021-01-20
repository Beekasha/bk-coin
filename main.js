const SHA256 = require('crypto-js/sha256');


class Transaction{
	constructor(fromAddress, toAddress, amount){
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}


class Block{
	constructor(timestamp, transactions, previousHash = ''){
		this.timestamp = timestamp;
		this.transactions = transactions;
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
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock(){
		return new Block('01/01/2021', "Genesis block", "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress){
		// this is not possible in real cryptocurrencies, as there are too many pending transactions at one time
		let block = new Block(Date.now(), this.pendingTransactions);
		block.mineBlock(this.difficulty);

		console.log("Block successfully mined!");
		this.chain.push(block);
		
		this.pendingTransactions = [
			new Transaction(null, miningRewardAddress, this.miningReward)
		];
	}

	createTransaction(transaction){
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address){
		let balance = 0;

		for(const block of this.chain){
			for(const trans of block.transactions){
				if(trans.fromAddress === address){
					balance -= trans.amount;
				}

				if(trans.toAddress === address){
					balance += trans.amount;
				}
			}
		}
		return balance;
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

//address1 and address2 will be the public key of someone's wallet in real crypto
bkCoin.createTransaction(new Transaction('address1', 'address2', 100));
bkCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...')
bkCoin.minePendingTransactions('xaviers-address');

// is 0 because the rewards are pending
console.log('\nBalance of xavier is', bkCoin.getBalanceOfAddress('xaviers-address'))

console.log('\n Starting the miner again...')
bkCoin.minePendingTransactions('xaviers-address');

// is 100, but new rewards are also pending as well
console.log('\nBalance of xavier is', bkCoin.getBalanceOfAddress('xaviers-address'))

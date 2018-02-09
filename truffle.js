// const HDWalletProvider = require('truffle-hdwallet-provider')
const HDWalletProvider = require('truffle-hdwallet-provider')
// const privatekey = '3199a084e7be5cb0db3a4b0dbe7568b5ba3b75d3f74c26344b440a44ae643576'
const mnemonic = 'basic comic diet borrow tomorrow link gun butter okay account drink repair'
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  // gas: 4698712,
  // gasPrice: 65000000000

/*
rinkeby: {
  provider: new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/lnIvoIuQhJcdEDaUyxw9', 2),
  from: "0x7f4c0aaa1f3be620694d04bd49c7dda881dd5936", // default address to use for any transaction Truffle makes during migrations
  network_id: 3
}
 */

  solc: {
		optimizer: {
			enabled: true,
			runs: 200
		}
	},
  networks: {
    development: {
     host: "localhost",
     port: 8545,
     network_id: "*",
     gas: 4698712
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/lnIvoIuQhJcdEDaUyxw9')
      },
      gas: 4698712,
      network_id: 4
    }
  },
};

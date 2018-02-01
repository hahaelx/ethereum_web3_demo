const DemoCoin= artifacts.require("./DemoCoin.sol")
const DemoCoinCrowdsale = artifacts.require("./DemoCoinCrowdsale.sol")
module.exports = function(deployer, network, accounts) {

  deployer.deploy(DemoCoin)
  const capped = 10000
  const startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1 // one second in the future
  const endTime = startTime + (86400 * 20) // 20 days
  const rate = new web3.BigNumber(1000)
  const wallet = accounts[0]
  deployer.deploy(DemoCoinCrowdsale, startTime, endTime, rate, capped, wallet).then(function(result){
    console.log('DemoCoinCrowdsale deploy')
    console.log(result);
  })
};

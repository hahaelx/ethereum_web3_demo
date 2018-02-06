const DemoCoinCrowdsale = artifacts.require("./DemoCoinCrowdsale.sol")
module.exports = function(deployer, network, accounts) {
  const startTime = Math.round((new Date(Date.now()).getTime())/1000); // now
  const endTime =  startTime + (86400 * 20) ; // Today + 20 days
  const rate = 1000 // rate ETH to DemoCoin
  deployer.deploy(DemoCoinCrowdsale,
    startTime,
    endTime,
    rate,
    "0x640c0a99376f1c40ca8474696d8230563674b7f1" // founds wallet
  );
};

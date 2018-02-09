const DemoCoinCrowdsale = artifacts.require("./DemoCoinCrowdsale.sol")
// const Hello = artifacts.require("./Hello.sol")
module.exports = function(deployer, network, accounts) {
  const startTime = Math.round((new Date(Date.now()).getTime())/1000) + 300; // now
  const endTime =  startTime + (86400 * 20) ; // Today + 20 days
  const rate = 1000 // rate ETH to DemoCoin
  deployer.deploy(DemoCoinCrowdsale,
    startTime,
    endTime,
    rate,
    "0x2c2df4e9d70649a055149670c90ec767d46c2186"
  );
  // deployer.deploy(Hello)
};

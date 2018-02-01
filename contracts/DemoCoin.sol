pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract DemoCoin is MintableToken {
  string public constant name = "Demo Coin";
  string public constant symbol = "DOC";
  uint8 public constant decimals = 18;
}

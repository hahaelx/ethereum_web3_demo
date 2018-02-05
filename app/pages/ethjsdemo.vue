<template lang="pug">
v-container
  v-layout( justify-center='', align-center='')
    v-flex(xs12='', sm8='', md6='', ma-3)
      v-card
        v-card-title.headline Demo Coin ICO Information
        v-card-text
          p Addr: {{this.owner.addr}}
          p Token Total Supply: {{this.icoInfo.totalSupply}}
          p ETH: {{owner.eth}}
          p Start Time: {{this.icoInfo.startTime}}
          p End Time: {{this.icoInfo.endTime}}
          p DemoCoin Rate: {{this.icoInfo.rate}}
          p weiRaised: {{this.icoInfo.weiRaised}}
      v-card.mt-3
        v-card-title.headline Your Wallet
        v-card-text
          p Addr: {{userInfo.addr}}
          p ETH: {{userInfo.eth}}
          p DemoCoin: {{userInfo.demoCoin}}
          v-card-actions
            v-text-field(label="Send Eth buy DemoCoin"
                  v-model="amounts"
                  prefix="$")
            v-btn(color="primary" @click.native="buyTcoin(userInfo.addr, amounts)") submit
</template>
<script>
// import moment from 'moment'
// const Web3 = require('web3')
// const Eth = require('ethjs-query')
// const EthContract = require('ethjs-contract')
// var web3

// init client web3 js
// if (process.browser) {
//   console.log('givenProvider=')
//   console.log(Web3.givenProvider)
//
//   // web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
//   web3 = new Web3('http://localhost:8545')
// }
// int server web3
export default {
  name: 'Wallet',
  data () {
    return {
    }
  },
  created: function () {
    console.log('== created ==')
  },
  mounted: function () {
    console.log('== mounted ==')
    this.test()
  },
  methods: {
    test: function () {
      console.log('test')
    }
  }
}
</script>

<style lang="css" scoped>
</style>

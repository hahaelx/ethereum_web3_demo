<template lang="pug">
v-container
  v-layout( justify-center='', align-center='')
    v-flex(xs12='', sm8='', md6='', ma-3)
      v-card
        v-card-title.headline Demo Coin ICO Information
        v-card-text
          p Ico Contract Addr: {{this.owner.icoAddr}}
          p Token Addr: {{this.owner.tokenAddr}}
          p Token Total Supply: {{this.icoInfo.totalSupply}}
          p Start Time: {{this.icoInfo.startTime}}
          p End Time: {{this.icoInfo.endTime}}
          p DemoCoin Rate: {{this.icoInfo.rate}}
          p weiRaised: {{this.icoInfo.weiRaised}}
      v-card.mt-3
        v-card-title.headline Your Wallet
        v-card-text
          p Addr: {{userInfo.addr}}
          p ETH: {{userInfo.ethBalance}}
          p DemoCoin: {{userInfo.tokenBalance}}
      v-card.mt-3
        v-card-title.headline Buy DemoCoin
        v-card-text
          p 1 Eth :1000 DemoCoin
        v-card-actions
          v-text-field(label="Ether"
                v-model="eth_amounts"
                prefix="$")
        v-card-actions
          v-spacer
          v-btn(color="primary" @click.native="buyDemoCoin(eth_amounts)") submit
      v-card.mt-3
        v-card-title.headline Transfer Demo Coin
        v-card-text
          v-text-field(label="Transfer to Address"
                v-model="transfer_address"
                prefix="")
          v-text-field(label="Demo Coin Amounts"
                v-model="token_amounts"
                prefix="$")
        v-card-actions
          v-spacer
          v-btn(color="primary" @click.native="transferDemoCoin(transfer_address, token_amounts)") submit
    v-dialog(v-model="dialog" max-width="320")
      v-card
        v-card-title dialog
</template>
<script>
import moment from 'moment'
var Web3 = require('web3')
var web3

// init client web3 js
if (process.browser) {
  console.log('givenProvider=')
  console.log(Web3.givenProvider)
  web3 = new Web3(Web3.givenProvider)
  // web3 = new Web3('http://localhost:8545')
}
// int server web3
export default {
  name: 'Wallet',
  data () {
    return {
      owner: {
        icoAddr: '0x7f8e6d8ce74b46ec8d2237c41e454a210cdabc33',
        tokenAddr: '',
        addr: '0x7f4c0aaa1f3be620694d04bd49c7dda881dd5936',
        ethBalance: 0,
        tokenBalance: 0
      },
      icoInfo: {
        totalSupply: 0,
        startTime: '',
        endTime: '',
        rate: 0,
        weiRaised: 0
      },
      userInfo: {
        addr: '',
        ethBalance: 0,
        tokenBalance: 0
      },
      icoContract: {},
      tokenContract: {},
      eth_amounts: '',
      token_amounts: '',
      transfer_address: '',
      dialog: false
    }
  },
  created: function () {
    console.log('== created ==')
  },
  mounted: function () {
    console.log('== mounted ==')
    this.initContract()

    // this.initOwner()
    // this.initICOContract()
    // this.test()
  },
  methods: {
    test: function () {
    },
    initContract: function () {
      console.log('== init Contract ==')
      if (!Web3.givenProvider) {
        this.dialog = true
      }
      var icoArtifact = require('../../build/contracts/DemoCoinCrowdsale.json')
      // init contract instance
      this.icoContract = new web3.eth.Contract(icoArtifact.abi, this.owner.icoAddr)
      console.log(this.icoContract)
      // add event watch
      // this.icoContract.events.TokenPurchase({}, {fromBlock: 0, toBlock: 'latest'}, function (error, event) {
      //   console.log('== Message ==')
      //   if (error) {
      //     console.error(error)
      //   }
      //   console.log(event)
      // })
      this.getTokenAddress()
    },
    getTokenAddress: function () {
      // get token address
      const self = this
      console.log('== getTokenAddress ==')
      console.log('owner addr' + this.owner.addr)
      console.log('icoAddr: ' + this.owner.icoAddr)
      this.icoContract.methods.token()
        .call({from: this.owner.addr}, function (error, result) {
          if (error) {
            console.log('icoContract token:')
            console.error(error)
            return
          }
          self.owner.tokenAddr = result
          console.log('this.owner.tokenAddr:' + result)
          var demoCoinArtifact = require('../../build/contracts/DemoCoin.json')
          self.tokenContract = new web3.eth.Contract(demoCoinArtifact.abi, self.owner.tokenAddr)
          console.log('==tokenContract==')
          console.log(self.tokenContract)
          self.getUserAddress()
          self.getContractInfo()
        }).catch(console.log)
    },
    getUserAddress: function () {
      // get user wallet address
      console.log('== getUserAddress ==')
      const self = this
      web3.eth.getAccounts().then((result) => {
        self.userInfo.addr = result[0]
        console.log('userInfo.addr:' + self.userInfo.addr)
        self.getUserBlance()
      }).catch(console.log)
    },
    getUserBlance: function () {
      console.log('== getUserBlance ==')
      const self = this
      // get user eth balnce
      web3.eth.getBalance(this.userInfo.addr).then((result) => {
        console.log('getBalance ETH:' + result)
        self.userInfo.ethBalance = web3.utils.fromWei(result, 'ether')
      }).catch(console.log)
      // get user token blance
      this.tokenContract.methods.balanceOf(this.userInfo.addr).call({from: this.userInfo.addr})
        .then((result) => {
          console.log('token balance:' + result)
          self.userInfo.tokenBalance = web3.utils.fromWei(result, 'ether')
        }).catch(console.log)
    },
    getContractInfo: function () {
      console.log('== getContractInfo ==')
      console.log(this.icoContract)
      const self = this
      // get Token balance
      this.tokenContract.methods.balanceOf(this.owner.addr)
        .call({from: this.owner.addr})
        .then((error, result) => {
          if (error) {
            console.log('get Token balance')
            console.log(error)
            return
          }
          console.log('owner democoin blance:' + result)
          self.owner.tokenBalance = web3.utils.fromWei(result, 'ether')
        })
      // get toke totalSupply
      this.tokenContract.methods.totalSupply()
        .call({from: this.owner.addr})
        .then((result) => {
          self.icoInfo.totalSupply = web3.utils.fromWei(result, 'ether')
          console.log('tokenContract totalSupply:' + self.icoInfo.totalSupply)
        })
      // get ico info:
      this.icoContract.methods.startTime()
        .call({from: this.owner.addr}, function (error, result) {
          if (error) {
            console.log('icoContract startTime')
            console.log(error)
            return
          }
          self.icoInfo.startTime = moment(result * 1000).format('YYYY-MM-DD HH:mm:ss')
          console.log('icoContract startTime:' + self.icoInfo.startTime)
        })
      this.icoContract.methods.endTime()
        .call({from: this.owner.addr}, function (error, result) {
          if (error) {
            console.log('icoContract endTime')
            console.log(error)
            return
          }
          // self.owner.endTime = result
          self.icoInfo.endTime = moment(result * 1000).format('YYYY-MM-DD HH:mm:ss')
        })
      this.icoContract.methods.rate()
        .call({from: this.owner.addr}, function (error, result) {
          if (error) {
            console.log('icoContract rate')
            console.log(error)
            return
          }
          self.icoInfo.rate = result
        })
      this.icoContract.methods.weiRaised()
        .call({from: this.owner.addr}, function (error, result) {
          if (error) {
            console.log('icoContract weiRaised')
            console.log(error)
            return
          }
          self.owner.weiRaised = result
        })
    },
    buyDemoCoin: function (amounts) {
      console.log('==buy Token==')
      const self = this
      var ethWei = web3.utils.toWei(amounts, 'ether')
      var param = {
        from: this.userInfo.addr,
        to: this.owner.icoAddr,
        value: ethWei
      }
      web3.eth.sendTransaction(param).then((receipt) => {
        console.log('buyDemoCoin receipt')
        console.log(receipt)
        self.getUserBlance()
        self.getContractInfo()
      }).catch((err) => {
        console.error(err.message)
      })
    },
    transferDemoCoin: function (address, amounts) {
      var value = web3.utils.toWei(amounts, 'ether')
      var param = {
        from: this.userInfo.addr
      }
      this.tokenContract.methods.transfer(address, value).send(param).then((receipt) => {
        console.log('transferDemoCoin receipt')
        console.log(receipt)
        self.getUserBlance()
        self.getContractInfo()
      }).catch((err) => {
        console.error(err.message)
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>

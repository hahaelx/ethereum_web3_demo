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
          v-card-actions
            v-text-field(label="Send Eth buy DemoCoin"
                  v-model="amounts"
                  prefix="$")
            v-btn(color="primary" @click.native="transferToContract(userInfo.addr, amounts)") submit
</template>
<script>
import moment from 'moment'
var Web3 = require('web3')
var clientWeb3

// init client web3 js
if (process.browser) {
  console.log('givenProvider=')
  console.log(Web3.givenProvider)
  clientWeb3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
}
// int server web3
var web3 = new Web3('http://localhost:8545')
export default {
  name: 'Wallet',
  data () {
    return {
      owner: {
        icoAddr: '0xdc5f9168d5997feccce1019c02f5bebe4a06b2bf',
        demoCoinAddr: '0x554653a183bdcce6bc4f8609be9d9f4f47267471',
        addr: '0xc658923308e2e38fc36ac02036a480fa864ff806',
        eth: 0,
        demoCoinBalance: 0
      },
      icoInfo: {
        totalSupply: 0,
        foundsAddr: '',
        startTime: '',
        endTime: '',
        rate: 0,
        weiRaised: 0
      },
      userInfo: {
        walletAddr: '',
        eth: 0,
        demoCoinBalance: 0
      },
      icoContract: {},
      tokenContract: {},
      amounts: ''
    }
  },
  created: function () {
    console.log('== created ==')
  },
  mounted: function () {
    console.log('== mounted ==')
    this.initWeb3()
    this.initOwner()
    this.initICOContract()
    this.test()
  },
  methods: {
    test: function () {
    },
    initWeb3: function () {
      console.log('== initWeb3 ==')
      const self = this
      var icoArtifact = require('../../build/contracts/DemoCoinCrowdsale.json')
      this.icoContract = new web3.eth.Contract(icoArtifact.abi, this.owner.icoAddr)
      var demoCoinArtifact = require('../../build/contracts/DemoCoin.json')
      this.tokenContract = new web3.eth.Contract(demoCoinArtifact.abi, this.owner.demoCoinAddr)
      clientWeb3.eth.getAccounts().then((result) => {
        self.userInfo.addr = result[0]
        self.initUserInfo()
        console.log('userInfo.addr:' + self.userInfo.addr)
      }).catch(console.log)
    },
    initOwner: function () {
      const self = this
      web3.eth.getBalance(this.owner.addr).then((result) => {
        console.log('getBalance:' + result)
        self.owner.eth = web3.utils.fromWei(result, 'ether')
        console.log('owner wallet:' + self.owner.eth)
      })
    },
    initUserInfo: function () {
      console.log('initUserInfo')
      const self = this
      clientWeb3.eth.getBalance(this.userInfo.addr).then((result) => {
        console.log('getBalance:' + this.userInfo.addr)
        console.log(result)
        self.userInfo.eth = web3.utils.fromWei(result, 'ether')
      })
    },
    initICOContract: function () {
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
          self.owner.demoCoinBalance = result
        })
      // get toke totalSupply
      this.tokenContract.methods.totalSupply()
        .call({from: this.owner.addr})
        .then((error, result) => {
          if (error) {
            console.log('get toke totalSupply')
            console.log(error)
            return
          }
          console.log('tokenContract totalSupply:' + result)
          self.icoInfo.totalSupply = result
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
    /**
     * transfer token
     * @param  {[String]} address [to address]
     * @param  {[number]} amounts   [transfer amounts]
     */
    transferToContract: function (address, amounts) {
      console.log('makeTransfer')
      console.log(this.icoContract)
      // const self = this
      this.icoContract.methods.buyTokens(address, amounts).send({from: this.add0})
        .then((result) => {
          alert('Transfer Successful!')
        }).catch((err) => {
          console.log(err.message)
        })
    }
  }
}
</script>

<style lang="css" scoped>
</style>

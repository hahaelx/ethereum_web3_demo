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
          p ETH: {{userInfo.ethBalance}}
          p DemoCoin: {{userInfo.tokenBalance}}
          v-card-actions
            v-text-field(label="Send Eth buy DemoCoin"
                  v-model="amounts"
                  prefix="$")
            v-btn(color="primary" @click.native="buyTcoin(userInfo.addr, amounts)") submit
</template>
<script>
import moment from 'moment'
var Web3 = require('web3')
var web3

// init client web3 js
if (process.browser) {
  console.log('givenProvider=')
  console.log(Web3.givenProvider)
  // web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
  web3 = new Web3('http://localhost:8545')
}
// int server web3
export default {
  name: 'Wallet',
  data () {
    return {
      owner: {
        icoAddr: '0x3bca9e0953e98df09c3f41054e2a5260c80b5646',
        tokenAddr: '',
        addr: '0xaa59c363dc4489e00f16a7db85aa0b5408cbd27a',
        ethBalance: 0,
        tokenBalance: 0
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
        addr: '',
        ethBalance: 0,
        tokenBalance: 0
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

      var icoArtifact = require('../../build/contracts/DemoCoinCrowdsale.json')
      // init contract instance
      this.icoContract = new web3.eth.Contract(icoArtifact.abi, this.owner.icoAddr)
      console.log(this.icoContract)
      // add event watch
      this.icoContract.events.Message('MyEvent', {}, function (error, event) {
        console.log('== Message ==')
        if (error) {
          console.error(error)
        }
        console.log(event)
      })
      this.getTokenAddress()
    },
    getTokenAddress: function () {
      // get token address
      const self = this
      console.log('== getTokenAddress ==')
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
          self.getUserAddress()
        }).catch(console.log)
    },
    getUserAddress: function () {
      // get user wallet address
      console.log('== getUserAddress ==')
      const self = this
      web3.eth.getAccounts().then((result) => {
        self.userInfo.addr = result[1]
        console.log('userInfo.addr:' + self.userInfo.addr)
        self.getUserBlance()
        self.getContractInfo()
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
          self.userInfo.tokenBalance = result
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
          self.owner.tokenBalance = result
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
    buyTcoin: function (address, amounts) {
      console.log('==buy Yoken==')
      console.log(address)
      var ethWei = web3.utils.toWei(amounts, 'ether')
      // var param = {
      //   from: address,
      //   to: this.owner.icoAddr,
      //   value: ethWei
      // }
      // console.log(param)
      // web3.eth.sendTransaction(param).then((receipt) => {
      //   console.log('receipt')
      //   console.log(receipt)
      // }).catch((err) => {
      //   console.error(err.message)
      // })
      this.icoContract.methods.buyTokens(address).send({from: address, value: ethWei})
        .then((result) => {
          alert('Transfer Successful!')
          self.getBalance()
        }).catch((err) => {
          console.log(err.message)
        })
    },
    send: function (address, amounts) {
      web3.eth.sendTransaction({
        from: address,
        to: this.owner.icoAddr,
        value: web3.utils.toWei(amounts, 'ether')
      }, function (error, result) {
        if (!error) {
          console.log('success')
        } else {
          console.error(error)
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>

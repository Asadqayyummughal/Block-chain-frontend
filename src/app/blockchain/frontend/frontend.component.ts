import { Component, OnInit ,ElementRef,ViewChild, Output} from '@angular/core';
import Web3 from 'web3';
import constants from 'src/app/constants/constant';
import globalVariabls from 'src/app/constants/globals';
import WalletConnectProvider from '@walletconnect/web3-provider';
import QrCodeModal from '@walletconnect/qrcode-modal'
import wallet from '@walletconnect/web3-provider'

declare var window:any;


@Component({
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.css']
})
export class FrontendComponent implements OnInit {
  @ViewChild('ctrlbtn') controleModal !:ElementRef;
  // @ViewChild('walletModal') wallet_modal !: ElementRef;
   public web3:any;
   public currentAccount:string='';
   public gas_limit:number=0;
   public gas_price:number=0;
   public connected_acount:any;
   public is_logged_in:boolean=false;
   public bar_width:any=10;
   CrowdContractAddress:any='0xf5BF6dB229667B63165a37e585fCAA50E683b2Fc';
   public provider:any= new WalletConnectProvider({
    bridge: 'https://bridge.walletconnect.org',
    infuraId:'102a56c56ffa4c31ae9037093d1a7c05',
    rpc: {
      56: "https://bsc-dataseed.binance.org"
    },
    qrcode:true,
    qrcodeModal:QrCodeModal
   })
  constructor() {
    this.web3=new Web3(Web3.givenProvider)
   }
  ngOnInit(): void {
    this.onAccountChange();
    this.onNetworkChange();
   
  }
  connectMetamask(){

    console.log('cehckoout native element::::',this.controleModal);
    this.controleModal.nativeElement.click();
    if(typeof window.ethereum!==undefined){
      window.ethereum.request({ method: 'eth_requestAccounts'}).then(async (accounts:Array<any>)=>{
        console.log(accounts);
        this.currentAccount=accounts[0];
        sessionStorage.setItem('wallet address',this.currentAccount);
        console.log('chceckout user balance...>',this.web3.eth.getBalance(this.currentAccount));
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('checkout chain id',chainId);
        this.setUpContract();
        this.checkUserNetwork(chainId);
        // this.addMaticNetwork();
       
      })
    }
    else{
      alert('Install metamsk first')
    }
    // this.web3.eth.requestAccounts().then((account:string|any)=>
    // {
    //   if(account){
    //     this.address=account;
    //     console.log('checout account....>',account);
    //      
    //       this.web3.eth.getBalance(account[0]).then((balance:string|undefined)=>{
    //         console.log('checkout user balance....', this.web3.utils.fromWei(balance));
    //       })
    //   }

    // }
     
    // )
  }

  checkUserNetwork(id: number) {
    console.log('not a valid network:::::');
    let our_network=globalVariabls.intentedNetwork;
    if(id!==our_network){
        if(our_network==1||our_network==4){
          this.switchNetwork(id)
        }
        else{
          if(our_network==97||our_network==56)
          this.addNetwork(id);

        }
     
    }
    
  }

  switchNetwork(id:any){
    let our_network=globalVariabls.intentedNetwork;
    let networkData ;
    if(our_network==1||our_network==4){
      switch (our_network) {
        case 1:
          networkData = [
            {
              chainId:this.web3.utils.toHex(our_network)
            },
          ];
          break;
        case 4:
          networkData = [
            {
              chainId: this.web3.utils.toHex(our_network)
            },
          ];
          break;
          default:
           [
              console.log('default section get called::::::')
              
           ]
            
      }
    
    }
  return window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params:  networkData,
  });

  }
   setUpContract(){
    let currentAccount=sessionStorage.getItem("wallet address");
    console.log('here is cureentAccount::::',currentAccount);
    let contract= new this.web3.eth.Contract(constants.USDTTestAbi,constants.USDTTestContractAddress)
     contract.methods.balanceOf(currentAccount).call().then((balance:any)=>{
      console.log('chekcout balance****',balance);
    }).catch((error:any)=>{
      console.log('Error Occured checkout::::',error);
      
    })
  }
  
  performTrxn(){
    let currentAccount=sessionStorage.getItem("wallet address");
    if(currentAccount){
      this.web3.eth.sendTransaction({from:currentAccount, data:'0x78b807C0184F3695C47615E44c611A373d990669'})
      .once('sending', function(payload:any){
          console.log('sending Event called check response',payload);
           })
      .once('sent', function(payload:any){  console.log(' sent event called check response',payload);})
      .once('transactionHash', function(hash:any){console.log('trxnhash event get called',hash);
      })
      .once('receipt', function(receipt:any){console.log('receipt event called check receipt',receipt)})
      .on('confirmation', function(confNumber:any, receipt:any, latestBlockHash:any)
      { console.log('confirmation event get Called check confNumber,receipt,latestBlock hash',confNumber,receipt,latestBlockHash);
       })
      .on('error', function(error:any){ console.log('Error occurenc detect error',error);
       })
      .then(function(receipt:any){
        console.log('receit has been mined:::: hurrah',receipt);
        
          // will be fired once the receipt is mined
      });
      
    }
    else{
      alert('Sender Does not exist')

    }
   
  }
  checkModules(){
    console.log('utlils',this.web3.utils);
    console.log('eth.network',this.web3.eth.network);
    console.log('modules:::',this.web3.modules);
    console.log('version',this.web3.version);
    console.log('provider::::',this.web3.provider);
    console.log('given provider:::',this.web3.givenProvider);
    console.log('current provider:::',this.web3.currentProvider);
    let contract=new this.web3.eth.Contract(constants.USDCTestAbi,constants.USDCTestContractAddress);
    console.log('total supply',contract.TotalSupply);
    let batch=new this.web3.BatchRequest();
    console.log('checout contract::::',contract);
    console.log('checout batchreq::::',batch);
    console.log(this.web3.eth.getAccounts());
  }
  
  disConnectMetamask(){
    sessionStorage.removeItem('wallet address');
    alert('metmask has been disconnected success')
  }
  addNetwork(id: number) {    
    let networkData;
    console.log('id ======>',id)
    switch (id) {
      //bsctestnet
      case 97:
        networkData = [
          {
            chainId: "0x61",
            chainName:"BSCTESTNET",
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
            nativeCurrency: {
              name: "BINANCE COIN",
              symbol: "BNB",
              decimals: 18,
            },
            blockExplorerUrls: ["https://testnet.bscscan.com/"],
          },
        ];
        break;
      //bscmainet
      case 56:
        networkData = [
          { 
            chainId: "0x38",
            chainName: "BSCMAINET",
            rpcUrls: ["https://bsc-dataseed1.binance.org"],
            nativeCurrency: {
              name: "BINANCE COIN",
              symbol: "BNB",
              decimals: 18,
            },
            blockExplorerUrls: ["https://bscscan.com/"],
          },
        ];
        break;
      default:
        break;
    }
    // agregar red o cambiar red
    return this.web3.ethereum.request({
      method: "wallet_addEthereumChain",
      params: networkData,
    });
  }
 

  
  onAccountChange(){
    window.ethereum.on('accountsChanged',(account:Array<string>)=>{
      this.currentAccount=account[0];
       sessionStorage.setItem('wallet address',this.currentAccount      )
      console.log('checkout Accunt changed',account);
  })
  }
  onNetworkChange(){
    window.ethereum.on('chainChanged',(id:string)=>{
      console.log('network change hogya lala g id check',id);
      
    })

  }
 
   connectWalletConnect(per:boolean){
    
    const web3 = new Web3(this.provider);
      web3.eth.requestAccounts((arr_accounts:any)=>{
      console.log('checkout connected accounts:::',arr_accounts);
      })
      console.log('get called....',per);
     let result=  this.provider.enable().then((accounts:any)=>{
      console.log('checkout ACCounts......',accounts);
      })
    setTimeout(()=>{
      this.controleModal.nativeElement.click();
   
    },500)
   
  
  }
  //add custom network
  async  addMaticNetwork() {
    try {
      const result = await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x89",
          rpcUrls: ["https://polygon-rpc.com/"],
          chainName: "Matic Mainnet",
          nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
          },
          blockExplorerUrls: ["https://polygonscan.com/"]
        }]
      });
    } catch (error){
      console.log(error)
    }
  }
  async switchChain(id:any) {
     
    // const { ethereum } = window;
    //   if (typeof ethereum !== 'undefined' && ethereum.isMetaMask) return;
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId:'0x56'}],  
        });
      } catch (switchError:any) {
        if (switchError.code === 4902) {
          // You can make a request to add the chain to wallet here
         window.ethereum.request({

         })
          console.log('Polygon Chain hasn not been added')
        }
      }
    }
    getEstimatedGas(){
      console.log('func called....>');
      this.web3.eth.getGasPrice((price:string)=>console.log('checkout gas price ***',price)
      )
       this.web3.eth.getBlock('latest').then((block:any)=>{
        let gasLimit = block?.gasLimit;
        let transactions = block?.transactions.length;
        this.gas_limit=gasLimit/transactions;
        console.log('yah lates blcok ha lala g',block);
        console.log('gas limit...>',block?.gasLimit);
         console.log('trnsactin in aa block::::',block?.transactions.length);
         console.log('estimated gasLimit',gasLimit/transactions);
       })       
       console.log('gas price fromWei >>>>>.',this.web3.eth.getGasPrice());
       this.web3.eth.getGasPrice().then((price:any) => {
        console.log('Estimated Gas Price =============> ',price);
         console.log(this.web3.utils.from);
         
      });

       
    }
  //add balance to your account
   addUsdtToMetaMask() {
      const tokenAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
      const tokenSymbol = 'USDT';
      const tokenDecimals = 18;
      const tokenImage = 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png';
      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals, // The number of decimals in the token
              image: tokenImage, // A string url of the token logo
            },
          },
        });
  
        if (wasAdded) {
          alert('Token added successfully');
        }
      } catch (error) {
        console.log(error);
      }
    }
    checkContractBal(){
      console.log('called:::::');
      let usdContract=new this.web3.eth.Contract(constants.USDCTestAbi,constants.USDCTestContractAddress);
      console.log('check usdContractj...',usdContract);
      
       this.connected_acount = sessionStorage.getItem('wallet address');

      //  if(this.connected_acount){
      // let user_balance= this.CrowdContractAddress.methods.balanceOf(this.connected_acount).call().then(
      //   (balance:any)=>{
      //     console.log('chekcout user balecn',user_balance);
          
      //   }
      //   );
      //  }

    }
  
    // demoElementref(){
    //   this.controleModal.nativeElement.click();
  
    // }
    // checkForWallet(){
    //   this.wallet_modal.nativeElement.click();
    // }

}

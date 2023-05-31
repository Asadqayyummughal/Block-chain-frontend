const globalVariabls={
    intentedNetwork: 1,
    currentContract: 0,
    currentBalance : '0',
    ether: 'ether',
    wei: 'wei',
    mwei: 'mwei'
}
const networks={
    EtherMainnet: {
        id: 1,
        name: 'Ethereum Mainnet',
    },
    Rinkeby: {
        id: 4,
        name: 'Rinkeby Testnet'
    } ,
    Goerli:{
        id:5,
        name:'Goerli'
    }  
}
export default globalVariabls;
export {networks}
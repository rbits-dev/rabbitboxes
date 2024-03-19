// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  chainId: [11155111,97, 80001, 1287,4,568],
  openseaChainIds: [1, 3, 4,2,5],
  providerURL: "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
  baseURL: "http://codetentacles-006-site31.htempurl.com/api/",
  // baseURL:'http://moonbox.codetentaclestechnologies.tech/api/api/',
  ownerAddress: "0x703632A0b52244fAbca04aaE138fA8EcaF72dCBC",
  // silverAddress: "0x46192Bd44C9066D425375326808109C7d97a2181",
  NFTAddress: "0x94f1f1B3038e11E07FbFcC82357F69691c40DF42",
  lootBoxAddress: "0x017792D0692591FF66686092293295ef245deD3b",
  artistNFTAddress: "0xe3D279f66776Efae7602D817f68015a0afA0Fd2E",
  buyContractAddress: "0xEF85Fd14392B24E86e43D2A3014C733F862bc7B8",
  tokenContractAddress: "0x3F4E053184Bef016286D07189FB60c61A6eF972F",
  bridgeCollectionAddress:"0x229620efb06cB366350Aae34469792FE1402Dc65",
  configFile: 'testnet',
  adminPanelUrl : "http://codetentacles-006-site41.htempurl.com/",

  mintNFTAddress:"0x38B71264E52467445F7d71CaDac4B0066B0e807A", // when bridge nft on bsc then mint nft eth chain on this address
  providerURLForEth:["https://ethereum-sepolia-rpc.publicnode.com","https://ethereum-sepolia-rpc.publicnode.com","https://eth-sepolia.public.blastapi.io","https://rpc.sepolia.org"],
  explorerURLForEth:"https://sepolia.etherscan.io/",
  // adminPanelUrl : 'http://moonbox.codetentaclestechnologies.tech/admin/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

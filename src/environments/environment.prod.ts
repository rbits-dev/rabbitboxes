export const environment = {
  production: true,
  chainId: [1, 56, 137, 1285, 2000],
  openseaChainIds: [1, 3, 4,2,5],

  providerURL: "https://bsc-dataseed1.binance.org",
  
  baseURL: "https://rbits.xyz/boxes/backend/api/",
  ownerAddress: "0x66A7B9f608378e59105022aB00b0F541666e8c4d",
  NFTAddress: "0x82A3E038048CF02C19e60856564bE209899d4F12",
  lootBoxAddress: "0x614A5DD989E5Fc086a0059D37F4EcDeaA6341216", 
  bridgeCollectionAddress:"",
  artistNFTAddress: "0xE93ddAA2d56F1DAF39177fe875698A147bC94f69",
  tokenContractAddress: "0xa6EbCC4C5C0316191eA95BFC90F591DF23A03DFE",

  configFile: 'mainnet',

  adminPanelUrl : "https://rbits.xyz/boxes/admin/",
  mintNFTAddress:"", //FIXME contract not yet deployed, should be moved to configFile referenced here
  explorerURLForEth:"https://etherscan.io/",
};

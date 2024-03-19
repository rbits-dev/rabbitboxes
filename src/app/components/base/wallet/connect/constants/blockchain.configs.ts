import { utils } from "ethers";

export const CHAIN_CONFIGS: any = {

  '1': {
    name: 'Ethereum Mainnet',
    icon: 'assets/media/images/blockchain/eth.webp',
    explorerLink: 'https://etherscan.io/address/',
    bg: 'white',
    symbol: 'ETH',
    config: {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x1',
          chainName: 'Ethereum Mainnet',
          rpcUrls: ['https://eth.llamarpc.com'], 
          // https://mainnet.infura.io/v3/${INFURA_API_KEY}
          blockExplorerUrls: ['https://etherscan.io/'],
          nativeCurrency: {
            symbol: 'ETH',
            decimals: 18,
          },
        },
      ],
    },
  },
  '1285': {
    name: 'Moonriver',
    explorerLink: 'https://moonriver.moonscan.io/address/',
    icon: 'assets/media/images/blockchain/MOVR.svg',
    bg: 'black',
    symbol: 'MOVR',
    config: {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x505',
          chainName: 'Moonriver',
          nativeCurrency: {
            symbol: 'MOVR',
            decimals: 18,
          },
          rpcUrls: ['https://rpc.api.moonriver.moonbeam.network'],
          blockExplorerUrls: ['https://moonriver.moonscan.io'],
        },
      ],
    },
  },
  '97': {
    name: 'BSC Testnet',
    explorerLink: 'https://testnet.bscscan.com/address/',
    icon: 'assets/media/images/blockchain/BSC.svg',
    bg: 'black',
    symbol: 'tBNB',
    config: {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x61',
          chainName: 'BNB Smart Chain Testnet',
          nativeCurrency: {
            symbol: 'tBNB',
            decimals: 18,
          },
          rpcUrls: ['https://data-seed-prebsc-2-s1.bnbchain.org:8545'],
          blockExplorerUrls: ['https://testnet.bscscan.com/'],
        },
      ],
    },
  },
  '56': {
    name: 'BNB Smart Chain Mainnet',
    explorerLink: 'https://bscscan.com/address/',
    icon: 'assets/media/images/blockchain/BSC.svg',
    bg: 'black',
    symbol: 'BNB',
    config: {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x38',
          chainName: 'BNB Smart Chain Mainnet',
          nativeCurrency: {
            symbol: 'BNB',
            decimals: 18,
          },
          rpcUrls: ['https://bsc-dataseed1.bnbchain.org'],
          blockExplorerUrls: ['https://bscscan.com'],
        },
      ],
    },
  },
  '137': {
    name: 'Polygon Mainnet',
    explorerLink: 'https://polygonscan.com/address/',
    icon: 'assets/media/images/blockchain/Polygon_Primary_Token.svg',
    bg: '#7b3fe4',
    symbol: 'MATIC',
    config: {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x89',
          chainName: 'Polygon Mainnet',
          nativeCurrency: {
            symbol: 'MATIC',
            decimals: 18,
          },
          rpcUrls: ['https://rpc.ankr.com/polygon'],
          blockExplorerUrls: ['https://polygonscan.com'],
        },
      ],
    },
  },
  '1287': {
    name: 'Moonbase Alpha',
    icon: 'assets/media/images/blockchain/MOVR.svg',
    explorerLink: 'https://moonbase.moonscan.io/address/',
    bg: 'black',
    symbol: 'DEV',
    config: {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x507',
          chainName: 'Moonbase Alpha',
          nativeCurrency: {
            symbol: 'DEV',
            decimals: 18,
          },
          rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
          blockExplorerUrls: ['https://moonbase.moonscan.io/'],
        },
      ],
    },
  },
  '80001': {
    name: 'Mumbai',
    icon: 'assets/media/images/blockchain/Polygon_Primary_Token.svg',
    explorerLink: 'https://mumbai.polygonscan.com/address/',
    bg: '#7b3fe4',
    symbol: 'MATIC',
    config: {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x13881',
          chainName: 'Mumbai',
          nativeCurrency: {
            symbol: 'MATIC',
            decimals: 18,
          },
          rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
          blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
        },
      ],
    },
  },
  '4': {
    name: 'Rinkeby',
    icon: 'assets/media/images/blockchain/eth.webp',
    explorerLink: 'https://rinkeby.etherscan.io/address/',
    bg: 'white',
    symbol: 'ETH',
    config: {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: utils.hexValue(4),
          chainName: 'Rinkeby',
          rpcUrls: ['https://rpc.ankr.com/eth_rinkeby'],
          blockExplorerUrls: ['https://rinkeby.etherscan.io/'],
        },
      ],
    },
  },
  '11155111': {
    name: 'Sepolia',
    icon: 'assets/media/images/blockchain/eth.webp',
    explorerLink: 'https://etherscan.io/address/',
    bg: 'white',
    symbol: 'ETH',
    config: {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0xAA36A7',
          chainName: 'Sepolia',
          nativeCurrency: {
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com', 'https://ethereum-sepolia-rpc.publicnode.com','https://eth-sepolia.public.blastapi.io', 'https://rpc.sepolia.org'],
          blockExplorerUrls: ['https://sepolia.etherscan.io/'],
        },
      ],
    },
  },
  '568': {
    name: 'Dogechain Testnet',
    explorerLink: 'https://explorer-testnet.dogechain.dog/address/',
    icon: 'assets/media/images/blockchain/dogecoin.svg',
    bg: '#000',
    symbol: 'dog',
    config: {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x238',
          chainName: 'dogechain Testnet',
          nativeCurrency: {
            symbol: 'DOGE',
            decimals: 18,
          },
          rpcUrls: ['https://rpc-testnet.dogechain.dog'],
          blockExplorerUrls: ['https://explorer-testnet.dogechain.dog'],
        },
      ],
    },
  },
  '2000': {
    name: 'Dogechain Mainnet',
    explorerLink: 'https://explorer.dogechain.dog/address/address/',
    icon: 'assets/media/images/blockchain/dogecoin.svg',
    bg: '#000',
    symbol: 'DOGE',
    config: {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x7D0',
          chainName: 'Dogechain Mainnet',
          nativeCurrency: {
            symbol: 'DOGE',
            decimals: 18,
          },
          rpcUrls: ['https://rpc.dogechain.dog'],
          blockExplorerUrls: ['https://explorer.dogechain.dog/'],
        },
      ],
    },
  }
};


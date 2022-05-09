export const marketAddress =
  process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS || ''
export const nftAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || ''
export const rpcURL =
  process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545/'

//Prod
//https://ipfs.infura.com/ipfs/
export const ipfsFileURL =
  process.env.NEXT_PUBLIC_IPFS_FILE_URL || 'https://ipfs.infura.io/ipfs/'

//Prod
//https://ipfs.infura.io:5001/api/v0
export const ipfsAPIURL =
  process.env.NEXT_PUBLIC_IPFS_API_URL || 'https://ipfs.infura.io:5001/api/v0'

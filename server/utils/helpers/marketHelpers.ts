import { ethers } from 'ethers'
import { rpcURL } from '../constants/config'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/MARKET.sol/Market.json'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { JsonRpcSigner } from '@ethersproject/providers'
import { Web3State } from '../../hooks/useWeb3State'
import { DigitalItem, MarketItem } from '../../pages/item/[...slug]'
import { marketAddress, nftAddress } from '../constants/contracts'
import { Market as IMarket, NFT as INFT } from '../../types'

export const activeSigner = async (web3State: Web3State) => {
  let signer: JsonRpcSigner
  // @ts-ignore
  try {
    await web3State.connectWallet()
    // @ts-ignore
    signer = web3State.provider.getSigner()
    signer.getAddress()
  } catch (e) {
    throw new Error('Wallet not ready or not available')
  }
  return signer
}

export const loadMarketItemUtil = async (
  tokenId: number,
  tokenAddress: string,
  web3State: Web3State
) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcURL)
  const tokenContract: INFT = new ethers.Contract(
    tokenAddress,
    NFT.abi,
    provider
  ) as INFT
  const marketContract: IMarket = new ethers.Contract(
    marketAddress,
    Market.abi,
    provider
  ) as IMarket
  let marketData, meta, tokenUri
  try {
    tokenUri = await tokenContract.uri(tokenId)
    meta = await axios.get(tokenUri)
    // This a new item with no market history
    marketData = await marketContract.fetchMarketItemByTokenId(tokenId)
  } catch (e) {
    meta = {
      data: { image: null, name: null, description: null },
    }
  }

  let approvedCount = 0,
    balance,
    isOwner = false
  try {
    let balanceResult
    if (web3State.address) {
      balanceResult = await tokenContract.balanceOf(web3State.address, tokenId)
    }
    if (balanceResult) {
      balance = balanceResult.toNumber()
      isOwner = balance > 0
    }
  } catch (e) {
    console.error(e)
  }

  if (marketData && marketData.status === 0) {
    let price = ethers.utils.formatUnits(marketData.price.toString(), 'ether')
    try {
      if (
        marketData.owner === '0x0000000000000000000000000000000000000000' &&
        web3State.address
      ) {
        isOwner = marketData.seller.toLowerCase() === web3State.address
      }
      if (isOwner) {
      }
    } catch (e) {
      console.error(e)
    }

    const marketItem: MarketItem = {
      tokenId,
      tokenAddress,
      price,
      itemId: marketData.itemId.toNumber() as number,
      seller: marketData.seller as string,
      owner: marketData.owner as string,
      image: meta.data.image as string,
      name: meta.data.name as string,
      description: meta.data.description as string,
      // @ts-ignore
      tokenUri,
      isOwner,
      approvedCount,
      meta,
      available: marketData.status === 0,
    }
    console.log({ marketItem })
    return marketItem
  } else {
    if (isOwner && web3State.address) {
      const result = await tokenContract.getApproved(
        web3State.address,
        marketAddress
      )
      approvedCount = result.toNumber()
    }
    let digitalItem: DigitalItem = {
      tokenId,
      tokenAddress,
      image: meta.data.image as string,
      name: meta.data.name as string,
      description: meta.data.description as string,
      // @ts-ignore
      tokenUri,
      approvedCount,
      meta,
      isOwner,
    }
    console.log({ digitalItem })
    return digitalItem
  }
}

export const loadMarketItemsUtil = async (
  assets: any[],
  web3State: Web3State
): Promise<(DigitalItem | MarketItem)[]> => {
  const items = await Promise.all(
    assets.map(
      async (asset) =>
        await loadMarketItemUtil(asset.tokenId, asset.tokenAddress, web3State)
    )
  )
  return items
}

export const buyMarketItemUtil = async (
  marketItem: MarketItem,
  web3State: Web3State
) => {
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)

  const signer = provider.getSigner()
  const contract: IMarket = new ethers.Contract(
    marketAddress,
    Market.abi,
    signer
  ) as IMarket
  const price = ethers.utils.parseUnits(marketItem.price.toString(), 'ether')
  const transaction = await contract.createMarketSale(
    marketItem.itemId,
    //TODO amount
    1,
    ethers.utils.toUtf8Bytes(''),
    {
      value: price,
    }
  )
  await transaction.wait()
  // console.log({ transaction })
}

export const sellItemUtil = async (
  digitalItem: DigitalItem,
  salePrice: string,
  web3State: Web3State
) => {
  const signer = await activeSigner(web3State)
  //Create Market Item
  const price = ethers.utils.parseUnits(salePrice, 'ether')
  const marketContract: IMarket = new ethers.Contract(
    marketAddress,
    Market.abi,
    signer
  ) as IMarket
  const listPriceResult = await marketContract.getListingPrice()
  const listingPrice = listPriceResult.toString()
  const marketTransaction = await marketContract.createMarketItem(
    nftAddress,
    digitalItem.tokenId,
    price,
    //TODO amount
    1,
    ethers.utils.toUtf8Bytes(''),
    { value: listingPrice }
  )
  await marketTransaction.wait()
  // console.log({ marketTransaction })
}

export const cancelMarketSaleUtil = async (
  marketItem: MarketItem,
  web3State: Web3State
) => {
  let signer: JsonRpcSigner
  // @ts-ignore
  try {
    await web3State.connectWallet()
    // @ts-ignore
    signer = web3State.provider.getSigner()
    signer.getAddress()
  } catch (e) {
    throw new Error('Wallet not ready or not available')
  }

  //Create Market Item
  const marketContract: IMarket = new ethers.Contract(
    marketAddress,
    Market.abi,
    signer
  ) as IMarket
  const marketTransaction = await marketContract.cancelMarketItem(
    marketItem.itemId,
    1,
    ethers.utils.toUtf8Bytes('')
  )
  await marketTransaction.wait()
  return marketTransaction
  // console.log({ marketTransaction })
}

export const approveMarketSaleUtil = async (
  digitalItem: DigitalItem,
  web3State: Web3State
) => {
  let signer: JsonRpcSigner
  // @ts-ignore
  try {
    await web3State.connectWallet()
    // @ts-ignore
    signer = web3State.provider.getSigner()
    signer.getAddress()
  } catch (e) {
    throw new Error('Wallet not ready or not available')
  }

  //Create Market Item
  const tokenContract: INFT = new ethers.Contract(
    nftAddress,
    NFT.abi,
    signer
  ) as INFT
  const approveTransaction = await tokenContract.approve(
    marketAddress,
    digitalItem.tokenId,
    //TODO amount
    1
  )

  await approveTransaction.wait()
  // console.log({ approveTransaction })
}

export const createAssetUtil = async (
  ipfsURL: string,
  signer: JsonRpcSigner,
  baseApiUrl: string
) => {
  // Create NFT
  const contract: INFT = new ethers.Contract(
    nftAddress,
    NFT.abi,
    signer
  ) as INFT
  const nftTransaction = await contract.createToken(
    ipfsURL,
    1,
    ethers.utils.toUtf8Bytes('')
  )
  const nftTx = await nftTransaction.wait()
  console.log({ nftTx })
  // @ts-ignore
  const event = nftTx.events[0]
  // @ts-ignore
  const value = event.args.id
  const tokenId = value.toNumber()
  console.log({ tokenId })

  const jobApi = await fetch(`${baseApiUrl}/assets/[slug]`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tokenId,
      tokenAddress: nftAddress,
    }),
  })

  let result = await jobApi.json()
  if (
    result.status === 'success' &&
    result.message &&
    result.message === 'done' &&
    result.data
  ) {
    return tokenId
  } else {
    return null
  }
}

export const createMarketListingUtil = async (
  tokenId: string,
  salePrice: string,
  signer: JsonRpcSigner
) => {
  console.log('createMarketItem called', tokenId)
  // @ts-ignore
  //Create Market Item
  const price = ethers.utils.parseUnits(salePrice, 'ether')
  const marketContract: IMarket = new ethers.Contract(
    marketAddress,
    Market.abi,
    signer
  ) as IMarket
  const listPriceResult = await marketContract.getListingPrice()
  const listingPrice = listPriceResult.toString()
  // console.log({ tokenId, price, listingPrice, salePrice })
  const marketTransaction = await marketContract.createMarketItem(
    nftAddress,
    tokenId,
    price,
    //TODO
    1,
    ethers.utils.toUtf8Bytes(''),
    { value: listingPrice }
  )
  await marketTransaction.wait()
  console.log({ marketTransaction })
  return true
}

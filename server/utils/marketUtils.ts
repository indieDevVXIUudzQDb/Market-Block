import { ethers } from 'ethers'
import { marketAddress, nftAddress, rpcURL } from './config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/MARKET.sol/Market.json'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { toast } from 'react-hot-toast'
import { toastConfig } from './toastConfig'
import { JsonRpcSigner } from '@ethersproject/providers'
import { DigitalItem, MarketItem } from '../pages/item/[id]'
import { Web3State } from '../hooks/useWeb3State'

export const loadMarketItemUtil = async (
  tokenId: number,
  web3State: Web3State
) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcURL)
  const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
  const marketContract = new ethers.Contract(
    marketAddress,
    Market.abi,
    provider
  )

  let marketData, meta, tokenUri
  try {
    tokenUri = await tokenContract.tokenURI(tokenId)
    meta = await axios.get(tokenUri)
    // This a new item with no market history
    marketData = await marketContract.fetchMarketItemByTokenId(tokenId)
  } catch (e) {
    meta = {
      data: { image: null, name: null, description: null },
    }
  }

  let approved,
    isApproved = false,
    balance,
    isOwner = false
  try {
    approved = await tokenContract.getApproved(tokenId)
    isApproved = marketAddress.toLowerCase() === approved.toLowerCase()
    let balanceResult
    if (web3State.address) {
      balanceResult = await tokenContract.balanceOf(web3State.address)
    }
    if (balanceResult) {
      balance = balanceResult.toNumber()
      isOwner = balance > 0
    }
  } catch (e) {
    console.error(e)
  }

  if (marketData) {
    let price = ethers.utils.formatUnits(marketData.price.toString(), 'ether')
    try {
      if (
        marketData.owner === '0x0000000000000000000000000000000000000000' &&
        web3State.address
      ) {
        isOwner = marketData.seller.toLowerCase() === web3State.address
      }
    } catch (e) {
      console.error(e)
    }

    const marketItem: MarketItem = {
      price,
      itemId: marketData.itemId.toNumber() as number,
      tokenId,
      seller: marketData.seller as string,
      owner: marketData.owner as string,
      image: meta.data.image as string,
      name: meta.data.name as string,
      description: meta.data.description as string,
      tokenUri,
      isOwner,
      isApproved,
      meta,
      sold: marketData.sold,
      available: marketData.status === 0,
    }
    // console.log({ marketItem })
    return marketItem
  } else {
    let digitalItem: DigitalItem = {
      tokenId,
      image: meta.data.image as string,
      name: meta.data.name as string,
      description: meta.data.description as string,
      tokenUri,
      isApproved,
      meta,
      isOwner,
    }
    // console.log({ digitalItem })
    return digitalItem
  }
}

export const loadMarketItemsUtil = async (
  assets: any[],
  web3State: Web3State
): Promise<(DigitalItem | MarketItem)[]> => {
  const provider = new ethers.providers.JsonRpcProvider(rpcURL)
  const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)

  const items = await Promise.all(
    assets.map(
      async (asset) => await loadMarketItemUtil(asset.tokenId, web3State)
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
  const contract = new ethers.Contract(marketAddress, Market.abi, signer)
  const price = ethers.utils.parseUnits(marketItem.price.toString(), 'ether')
  const transaction = await contract.createMarketSale(marketItem.itemId, {
    value: price,
  })
  await transaction.wait()
  // console.log({ transaction })
}

export const sellItemUtil = async (
  digitalItem: DigitalItem,
  salePrice: string,
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
  const price = ethers.utils.parseUnits(salePrice, 'ether')
  const marketContract = new ethers.Contract(marketAddress, Market.abi, signer)
  const listPriceResult = await marketContract.getListingPrice()
  const listingPrice = listPriceResult.toString()
  const marketTransaction = await marketContract.createMarketItem(
    nftAddress,
    digitalItem.tokenId,
    price,
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
  const marketContract = new ethers.Contract(marketAddress, Market.abi, signer)
  const marketTransaction = await marketContract.cancelMarketItem(
    marketItem.itemId
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
  const tokenContract = new ethers.Contract(nftAddress, NFT.abi, signer)
  const approveTransaction = await tokenContract.approve(
    marketAddress,
    digitalItem.tokenId
  )

  await approveTransaction.wait()
  // console.log({ approveTransaction })
  toast.success('Market listing approved', toastConfig)
}

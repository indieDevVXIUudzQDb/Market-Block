import { ethers } from 'ethers'
import { rpcURL } from '../constants/config'
import Fungible from '../../artifacts/contracts/Fungible.sol/Fungible.json'
import Market from '../../artifacts/contracts/MARKET.sol/Market.json'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { JsonRpcSigner } from '@ethersproject/providers'
import { Web3State } from '../../hooks/useWeb3State'
import { DigitalItem, MarketItem } from '../../pages/item/[...slug]'
import { marketAddress, fungibleAddress } from '../constants/contracts'
import { Market as IMarket, Fungible as IFungible } from '../../types'

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
  const tokenContract: IFungible = new ethers.Contract(
    tokenAddress,
    Fungible.abi,
    provider
  ) as IFungible
  const marketContract: IMarket = new ethers.Contract(
    marketAddress,
    Market.abi,
    provider
  ) as IMarket
  let marketRawItems: string | any[] = [],
    meta,
    tokenUri
  try {
    tokenUri = await tokenContract.uri(tokenId)
    meta = await axios.get(tokenUri)
  } catch (e) {
    meta = {
      data: { image: null, name: null, description: null },
    }
  }
  try {
    marketRawItems = await marketContract.fetchMarketItemsForToken(
      tokenId.toString()
    )
    console.log({ marketRawItems })
  } catch (e) {
    console.error(e)
  }

  let amountApproved = 0,
    amountOwnedListed = 0,
    amountOwnedUnlisted = 0,
    amountReadyForListing = 0,
    amountOwned = 0
  try {
    let balanceResult
    if (web3State.address) {
      balanceResult = await tokenContract.balanceOf(web3State.address, tokenId)
      // console.log({ balanceResult })
      amountOwned = balanceResult.toNumber()
      // console.log({ amountOwned })
    }
  } catch (e) {
    console.error(e)
  }
  const marketItems = []

  for (let i = 0; i < marketRawItems.length; i++) {
    const marketData = marketRawItems[i]
    let price = ethers.utils.formatUnits(marketData.price.toString(), 'ether')

    const marketItem: MarketItem = {
      price,
      itemId: marketData.itemId.toNumber() as number,
      seller: marketData.seller as string,
      owner: marketData.owner as string,
      amountAvailable: marketData.remainingAmount.toNumber() as number,
      isSeller:
        marketData.seller.toLowerCase() === web3State.address?.toLowerCase(),
    }
    const isCurrentOwner =
      marketItem.seller.toLowerCase() === web3State.address?.toLowerCase()
    if (marketItem && isCurrentOwner) {
      amountOwned += marketItem.amountAvailable
      amountOwnedListed += marketItem.amountAvailable
    }
    console.log({ marketItem })
    marketItems.push(marketItem)
  }
  if (web3State.address) {
    const result = await tokenContract.getApprovedForSeller(
      web3State.address,
      marketAddress,
      tokenId
    )
    amountApproved = result.toNumber()
    console.log({ amountApproved })
  }
  amountOwnedUnlisted = amountOwned - amountOwnedListed
  amountReadyForListing =
    amountOwnedUnlisted - (amountOwnedUnlisted - amountApproved)
  let digitalItem: DigitalItem = {
    tokenId,
    tokenAddress,
    image: meta.data.image as string,
    name: meta.data.name as string,
    description: meta.data.description as string,
    // @ts-ignore
    tokenUri,
    amountApproved,
    meta,
    marketItems,
    amountOwned,
    amountOwnedListed,
    amountOwnedUnlisted,
    amountReadyForListing,
  }
  console.log({ digitalItem })
  return digitalItem
}

export const loadMarketItemsUtil = async (
  assets: any[],
  web3State: Web3State
): Promise<DigitalItem[]> => {
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
  web3State: Web3State,
  amount: string
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
  const totalPrice: number = Number(marketItem.price) * Number(amount)
  const price = ethers.utils.parseUnits(totalPrice.toString(), 'ether')
  const transaction = await contract.createMarketSale(
    marketItem.itemId,
    amount,
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
  web3State: Web3State,
  amount: string
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
    fungibleAddress,
    digitalItem.tokenId,
    price,
    amount,
    ethers.utils.toUtf8Bytes(''),
    { value: listingPrice }
  )
  await marketTransaction.wait()
  // console.log({ marketTransaction })
}

export const cancelMarketSaleUtil = async (
  marketItem: MarketItem,
  web3State: Web3State,
  amount: string
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
    amount,
    ethers.utils.toUtf8Bytes('')
  )
  await marketTransaction.wait()
  return marketTransaction
  // console.log({ marketTransaction })
}

export const approveMarketSaleUtil = async (
  digitalItem: DigitalItem,
  web3State: Web3State,
  amount: string
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
  const tokenContract: IFungible = new ethers.Contract(
    fungibleAddress,
    Fungible.abi,
    signer
  ) as IFungible
  const approveTransaction = await tokenContract.approve(
    marketAddress,
    digitalItem.tokenId,
    amount
  )

  await approveTransaction.wait()
  // console.log({ approveTransaction })
}

export const createAssetUtil = async (
  ipfsURL: string,
  signer: JsonRpcSigner,
  baseApiUrl: string,
  amount: number
) => {
  // Create Fungible
  const contract: IFungible = new ethers.Contract(
    fungibleAddress,
    Fungible.abi,
    signer
  ) as IFungible
  const nftTransaction = await contract.createToken(
    ipfsURL,
    amount,
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
      tokenAddress: fungibleAddress,
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
  signer: JsonRpcSigner,
  amount: number
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
    fungibleAddress,
    tokenId,
    price,
    amount,
    ethers.utils.toUtf8Bytes(''),
    { value: listingPrice }
  )
  await marketTransaction.wait()
  console.log({ marketTransaction })
  return true
}

import type { NextPage } from 'next'
import { Group } from '@mantine/core'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/MARKET.sol/Market.json'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { marketAddress, nftAddress } from '../utils/config'
import axios from 'axios'
import { Layout } from './Layout'
import Web3Modal from 'web3modal'

export type LoadingState = 'not-loaded' | 'loaded'

export interface MarketItem {
  price: string
  tokenUri: string
  tokenId: number
  seller: string
  owner: string
  image: string
  name: string
  description: string
}
const Home: NextPage = () => {
  const [marketItems, setMarketItems] = useState<MarketItem[]>([])
  const [loadingState, setLoadingState] = useState<LoadingState>('not-loaded')

  const loadMarketItems = async () => {
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(
      marketAddress,
      Market.abi,
      provider
    )

    const data = await marketContract.fetchAvailableMarketItems()

    const items = await Promise.all(
      data.map(
        async (i: {
          tokenId: { toNumber: () => any }
          price: { toString: () => ethers.BigNumberish }
          seller: any
          owner: any
        }) => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId)
          const meta = await axios.get(tokenUri)
          const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
          const item: MarketItem = {
            price,
            tokenUri,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          }
          return item
        }
      )
    )
    setMarketItems(items)
  }
  useEffect(() => {
    loadMarketItems()
  }, [])

  const buyMarketItem = async (marketItem: MarketItem) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)

    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketAddress, Market.abi, signer)
    const price = ethers.utils.parseUnits(marketItem.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(
      nftAddress,
      marketItem.tokenId,
      {
        value: price,
      }
    )
    await transaction.wait()
    loadMarketItems()
  }

  return (
    <Layout>
      {loadingState === 'loaded' && !marketItems.length ? (
        <p>No items available in the market</p>
      ) : loadingState === 'loaded' && marketItems.length ? (
        <>
          {marketItems.map((item: MarketItem) => (
            <Group>
              <p>{item.name}</p>
              <button onClick={() => buyMarketItem(item)}>Buy</button>
            </Group>
          ))}
        </>
      ) : null}
      <div style={{ minHeight: '1000px' }}></div>
    </Layout>
  )
}

export default Home

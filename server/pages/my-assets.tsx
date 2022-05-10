import type { NextPage } from 'next'
import { Group, SimpleGrid } from '@mantine/core'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/MARKET.sol/Market.json'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { marketAddress, nftAddress, rpcURL } from '../utils/config'
import axios from 'axios'
import { Layout } from '../components/Layout'
import Web3Modal from 'web3modal'
import { MarketItemCard } from '../components/MarketItemCard'

export type LoadingState = 'not-loaded' | 'loaded'

export interface MarketItem {
  price: string
  itemId: number
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
    const provider = new ethers.providers.JsonRpcProvider(rpcURL)
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(
      marketAddress,
      Market.abi,
      provider
    )
    const data = await marketContract.fetchMyMarketItems()

    const items = await Promise.all(
      data.map(
        async (i: {
          tokenId: any
          price: { toString: () => ethers.BigNumberish }
          itemId: { toNumber: () => number }
          seller: string
          owner: string
        }) => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId)
          const meta = await axios.get(tokenUri)
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
          let item: MarketItem = {
            price,
            itemId: i.itemId.toNumber() as number,
            seller: i.seller as string,
            owner: i.owner as string,
            image: meta.data.image as string,
            name: meta.data.name as string,
            description: meta.data.description as string,
          }
          return item
        }
      )
    )
    setMarketItems(items)
    setLoadingState('loaded')
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
      marketItem.itemId,
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
        <p>No assets owned</p>
      ) : loadingState === 'loaded' && marketItems.length ? (
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            { maxWidth: 980, cols: 2, spacing: 'md' },
            { maxWidth: 755, cols: 1, spacing: 'sm' },
            { maxWidth: 600, cols: 1, spacing: 'sm' },
          ]}
          style={{ marginLeft: '3em' }}
        >
          {marketItems.map((item: MarketItem, index) => (
            <MarketItemCard
              key={index}
              id={item.itemId.toString()}
              description={item.description}
              image={item.image}
              linkTo={`/item/${item.itemId}`}
              title={item.name}
            />
          ))}
        </SimpleGrid>
      ) : null}
      <div style={{ minHeight: '1000px' }}></div>
    </Layout>
  )
}

export default Home

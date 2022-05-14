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
import { useWeb3State, Web3State } from '../hooks/useWeb3State'
import { DigitalItem } from './item/[id]'

export type LoadingState = 'not-loaded' | 'loaded'

const Home: NextPage = () => {
  const [marketItems, setMarketItems] = useState<DigitalItem[]>([])
  const [loadingState, setLoadingState] = useState<LoadingState>('not-loaded')
  const web3State: Web3State = useWeb3State()

  const loadMarketItems = async () => {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL)
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(
      marketAddress,
      Market.abi,
      provider
    )
    const data = await marketContract.fetchMarketItems()

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
          let item: DigitalItem = {
            image: meta.data.image as string,
            name: meta.data.name as string,
            description: meta.data.description as string,
            tokenId: i.tokenId,
            tokenUri,
            meta,
            //TODO
            isApproved: false,
            isOwner: false,
          }
          console.log({ items })
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

  return (
    <Layout web3State={web3State}>
      {loadingState === 'loaded' && !marketItems.length ? (
        <p>No assets available in the market</p>
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
          {marketItems.map((item: DigitalItem, index) => (
            <MarketItemCard key={index} item={item} />
          ))}
        </SimpleGrid>
      ) : null}
      <div style={{ minHeight: '1000px' }}></div>
    </Layout>
  )
}

export default Home

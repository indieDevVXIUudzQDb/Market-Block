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
import { DigitalItem, MarketItem } from './item/[id]'
import { loadMarketItemsUtil } from '../utils/marketUtils'
import { absoluteUrl, getAppCookies } from '../middleware/utils'

export type LoadingState = 'not-loaded' | 'loaded'

const Home: (props: {
  origin: string
  assets: any[]
}) => JSX.Element = (props: { origin: string; assets: any[] }) => {
  // @ts-ignore
  const { origin, assets } = props

  const [marketItems, setMarketItems] = useState<(DigitalItem | MarketItem)[]>(
    []
  )
  const [loading, setLoading] = useState<boolean>(false)
  const web3State: Web3State = useWeb3State()

  const loadItems = async () => {
    try {
      setLoading(true)
      const results = await loadMarketItemsUtil(assets, web3State)
      console.log({ results })
      setMarketItems(results)
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }
  useEffect(() => {
    loadItems()
  }, [])

  return (
    <Layout web3State={web3State}>
      {!loading && !marketItems.length ? (
        <p>No assets available in the market</p>
      ) : !loading && marketItems.length ? (
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

/* getServerSideProps */
/* getServerSideProps */
export async function getServerSideProps(context: { query: any; req: any }) {
  const { query, req } = context
  const { nextPage } = query
  const { origin } = absoluteUrl(req)

  // const token = getAppCookies(req).token || ''
  const referer = req.headers.referer || ''

  const nextPageUrl = !isNaN(nextPage) ? `?nextPage=${nextPage}` : ''
  const baseApiUrl = `${origin}/api`

  const response = await fetch(`${baseApiUrl}/assets${nextPageUrl}`, {
    // headers: {
    //   authorization: token || '',
    // },
  })

  let assets = []
  try {
    const res = await response.json()
    assets = res.data
    console.log({ assets })
  } catch (e) {
    console.error(e)
  }

  return {
    props: {
      origin,
      referer,
      assets,
    },
  }
}

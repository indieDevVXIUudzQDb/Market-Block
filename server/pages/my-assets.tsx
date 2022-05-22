import { Box, SimpleGrid, useMantineTheme } from '@mantine/core'
import Market from '../artifacts/contracts/MARKET.sol/Market.json'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Layout } from '../components/Layout'
import Web3Modal from 'web3modal'
import { MarketItemCard } from '../components/MarketItemCard'
import { useWeb3State, Web3State } from '../hooks/useWeb3State'
import { DigitalItem, MarketItem } from './item/[...slug]'
import { loadMarketItemsUtil } from '../utils/helpers/marketHelpers'
import { absoluteUrl } from '../middleware/utils'
import { marketAddress, fungibleAddress } from '../utils/constants/contracts'

const MyAssets: (props: {
  origin: string
  nextPageUrl: string
}) => JSX.Element = (props: { origin: string; nextPageUrl: string }) => {
  const { origin, nextPageUrl } = props

  const [marketItems, setMarketItems] = useState<DigitalItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const theme = useMantineTheme()

  const web3State: Web3State = useWeb3State()

  const loadMarketItems = async () => {
    try {
      if (!web3State.address) return
      setLoading(true)
      const baseApiUrl = `${origin}/api`

      const response = await fetch(
        `${baseApiUrl}/assets/my-assets?queryAddress=${web3State.address}${nextPageUrl}`,
        {
          // headers: {
          //   authorization: token || '',
          // },
        }
      )

      let assets = []
      try {
        const res = await response.json()
        assets = res.data
        console.log({ assets })
      } catch (e) {
        console.error('client', e)
      }
      const results = await loadMarketItemsUtil(assets, web3State)
      console.log({ results })
      setMarketItems(results)
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }
  useEffect(() => {
    loadMarketItems()
  }, [web3State.address])

  const buyMarketItem = async (marketItem: MarketItem) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)

    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketAddress, Market.abi, signer)
    const price = ethers.utils.parseUnits(marketItem.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(
      fungibleAddress,
      marketItem.itemId,
      {
        value: price,
      }
    )
    await transaction.wait()
    loadMarketItems()
  }

  return (
    <Layout web3State={web3State}>
      {!loading && !marketItems.length ? (
        <p>No assets owned</p>
      ) : !loading && marketItems.length ? (
        <Box
          sx={{
            maxWidth: 1200,
            padding: theme.spacing.xl,
            borderRadius: theme.radius.md,
            cursor: 'pointer',
            marginBottom: '20%',
          }}
          mx="auto"
        >
          <SimpleGrid
            cols={3}
            spacing="xl"
            breakpoints={[
              { maxWidth: 980, cols: 2, spacing: 'md' },
              { maxWidth: 755, cols: 1, spacing: 'sm' },
              { maxWidth: 600, cols: 1, spacing: 'sm' },
            ]}
            style={{ marginLeft: '3em', marginTop: '3em' }}
          >
            {marketItems.map((item, index) => (
              <MarketItemCard key={index} item={item} />
            ))}
          </SimpleGrid>
        </Box>
      ) : null}
      <div style={{ minHeight: '1000px' }}></div>
    </Layout>
  )
}

export async function getServerSideProps(context: { query: any; req: any }) {
  const { query, req } = context
  const { nextPage, address } = query
  const { origin } = absoluteUrl(req)

  // const token = getAppCookies(req).token || ''
  const referer = req.headers.referer || ''

  const nextPageUrl = !isNaN(nextPage) ? `nextPage=${nextPage}` : ''

  return {
    props: {
      origin,
      referer,
      nextPageUrl,
    },
  }
}

export default MyAssets

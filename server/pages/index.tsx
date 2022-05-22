import { Box, SimpleGrid, useMantineTheme } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { MarketItemCard } from '../components/MarketItemCard'
import { useWeb3State, Web3State } from '../hooks/useWeb3State'
import { DigitalItem, MarketItem } from './item/[...slug]'
import { loadMarketItemsUtil } from '../utils/helpers/marketHelpers'
import { absoluteUrl } from '../middleware/utils'

const Home: (props: {
  origin: string
  assets: any[]
}) => JSX.Element = (props: { origin: string; assets: any[] }) => {
  // @ts-ignore
  const { origin, baseApiUrl, nextPage: nextPage } = props

  const [marketItems, setMarketItems] = useState<DigitalItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const web3State: Web3State = useWeb3State()
  const theme = useMantineTheme()
  const loadItems = async () => {
    try {
      setLoading(true)
      const baseApiUrl = `${origin}/api`
      const nextPageUrl = nextPage ? nextPage : ''

      const response = await fetch(`${baseApiUrl}/assets?${nextPageUrl}`, {
        // headers: {
        //   authorization: token || '',
        // },
      })

      let assets = []
      try {
        const res = await response.json()
        assets = res.data
      } catch (e) {
        console.error(e)
      }
      console.log({ assets })
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
            {marketItems.map((item: DigitalItem, index) => (
              <MarketItemCard key={index} item={item} />
            ))}
          </SimpleGrid>
        </Box>
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

  return {
    props: {
      origin,
      referer,
      nextPageUrl,
    },
  }
}

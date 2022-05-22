import type { NextPage } from 'next'
import {
  Anchor,
  Button,
  Card,
  Group,
  Image,
  SimpleGrid,
  Table,
  Title,
} from '@mantine/core'
import { ReactElement, useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import { useRouter } from 'next/router'
import { Prism } from '@mantine/prism'
import { CURRENCY_NAME, LOGO_URL } from '../../utils/constants/constants'
import { useWeb3State, Web3State } from '../../hooks/useWeb3State'
import { SellModal } from '../../components/SellModal'
import { toast } from 'react-hot-toast'
import { toastConfig } from '../../utils/constants/toastConfig'
import {
  approveMarketSaleUtil,
  buyMarketItemUtil,
  cancelMarketSaleUtil,
  loadMarketItemUtil,
  sellItemUtil,
} from '../../utils/helpers/marketHelpers'
import { ApproveModal } from '../../components/ApproveModal'
import { BuyModal } from '../../components/BuyModal'
import { CancelListingModal } from '../../components/CancelListingModal'

export interface DigitalItem {
  tokenId: number
  tokenAddress: string
  image: string
  name: string
  description: string
  tokenUri: string
  meta: any
  amountApproved: number
  amountOwned: number
  amountListed: number
  marketItems: MarketItem[]
}

export interface MarketItem {
  price: string
  itemId: number
  seller: string
  owner: string
  amountAvailable: number
  isSeller: boolean
}

const ItemDetail: NextPage = () => {
  const router = useRouter()
  const { slug } = router.query
  // console.log({ router })
  const web3State: Web3State = useWeb3State()

  const [item, setItem] = useState<DigitalItem | null>()
  const [targetMarketItem, setTargetMarketItem] = useState<MarketItem | null>()
  const [loading, setLoading] = useState<boolean>(false)
  const [sellOpened, setSellOpened] = useState(false)
  const [approveOpened, setApproveOpened] = useState(false)
  const [buyOpened, setBuyOpened] = useState(false)
  const [cancelListingOpened, setCancelListingOpened] = useState(false)

  const loadMarketItem = async () => {
    let tokenId
    try {
      let tokenAddress, tokenIdRaw
      if (slug != null) {
        tokenAddress = slug[0]
        tokenIdRaw = slug[1]
      } else {
        return
      }
      if (
        tokenIdRaw &&
        typeof tokenIdRaw === 'string' &&
        tokenAddress &&
        typeof tokenAddress === 'string'
      ) {
        tokenId = parseInt(tokenIdRaw)
        if (typeof tokenId !== 'number') {
          throw new Error('tokenId is NAN')
        }
        setLoading(true)
        // console.log({ tokenId, tokenAddress })
        let loaded = await loadMarketItemUtil(tokenId, tokenAddress, web3State)
        setItem(loaded)
        setLoading(false)
      }
    } catch (e) {
      setLoading(false)
    }
  }

  const buyMarketItem = async (marketItem: MarketItem, amount: string) => {
    try {
      await buyMarketItemUtil(marketItem, web3State, amount)
      toast.success('Market Item Created', toastConfig)
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong', toastConfig)
    }
    loadMarketItem()
  }

  const sellItem = async (
    digitalItem: DigitalItem,
    salePrice: string,
    amount: string
  ) => {
    try {
      await sellItemUtil(digitalItem, salePrice, web3State, amount)
      toast.success('Market Item Created', toastConfig)
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong', toastConfig)
    }
    loadMarketItem()
  }

  const cancelMarketSale = async (marketItem: MarketItem, amount: string) => {
    try {
      await cancelMarketSaleUtil(marketItem, web3State, amount)
      toast.success('Market Item Created', toastConfig)
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong', toastConfig)
    }
    loadMarketItem()
  }

  const approveMarketSale = async (
    digitalItem: DigitalItem,
    amount: string
  ) => {
    try {
      await approveMarketSaleUtil(digitalItem, web3State, amount)
      toast.success('Market listing approved', toastConfig)
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong', toastConfig)
    }
    loadMarketItem()
  }

  useEffect(() => {
    loadMarketItem()
  }, [slug, web3State.address])

  return (
    <Layout web3State={web3State}>
      {!loading && !item ? (
        <p>Item not found</p>
      ) : !loading && item ? (
        <>
          {item ? (
            <>
              <SellModal
                opened={sellOpened}
                setOpened={setSellOpened}
                onConfirmClick={sellItem}
                item={item}
              />
              <ApproveModal
                opened={approveOpened}
                setOpened={setApproveOpened}
                onConfirmClick={approveMarketSale}
                item={item}
              />
              {targetMarketItem ? (
                <CancelListingModal
                  opened={cancelListingOpened}
                  setOpened={setCancelListingOpened}
                  onConfirmClick={cancelMarketSale}
                  item={targetMarketItem}
                />
              ) : null}

              {targetMarketItem ? (
                <BuyModal
                  opened={buyOpened}
                  setOpened={setBuyOpened}
                  onConfirmClick={buyMarketItem}
                  item={targetMarketItem}
                />
              ) : null}
            </>
          ) : null}
          <Card
            shadow="sm"
            p="lg"
            style={{
              margin: '3em',
              marginLeft: '3em',
              minHeight: '90%',
            }}
          >
            <SimpleGrid cols={1}>
              <Group position="center" style={{ marginBottom: 5 }}>
                <Title align={'center'}>{item.name}</Title>
              </Group>
              <Card.Section>
                <div style={{ textAlign: 'center' }}>
                  <Image
                    src={item.image}
                    height={160}
                    alt={item.name}
                    fit="contain"
                    withPlaceholder
                    placeholder={
                      <Image
                        src={`${LOGO_URL}`}
                        height={160}
                        alt={'logo'}
                        fit="contain"
                      />
                    }
                  />
                </div>
              </Card.Section>
              <Group position={'left'}>
                <p>
                  <b>Description: </b>
                  <br />
                  {item.description}
                </p>
              </Group>
              <Group position={'left'}>
                <p>
                  <b>URL: </b>
                  <br />
                  <Anchor href={item.tokenUri} target="_blank">
                    {item.tokenUri}
                  </Anchor>
                </p>
              </Group>
              <Group position={'left'} grow>
                <b>Meta Data: </b>
              </Group>
              <Group position={'left'} grow>
                <Prism language={'json'} color={'blue'}>
                  {JSON.stringify(item.meta.data)}
                </Prism>
              </Group>
              <Group position={'left'}>
                <p>
                  <b>Quantiy Owned: </b>
                  <br />
                  {item.amountOwned}
                </p>
              </Group>
              {!web3State.connected ? (
                <Group position={'left'} grow>
                  <Button color={'gray'}>Wallet not connected</Button>
                  <div />
                </Group>
              ) : null}

              {item && item.amountOwned && item.amountApproved > 0 ? (
                <Group position={'left'} grow>
                  <Button
                    onClick={() => {
                      setSellOpened(true)
                    }}
                  >
                    List for Sale
                  </Button>
                  <div />
                </Group>
              ) : null}
              {item && item.amountOwned - item.amountApproved > 0 ? (
                <Group position={'left'} grow>
                  <Button
                    color={'orange'}
                    onClick={() => {
                      setApproveOpened(true)
                    }}
                  >
                    Approve for Sale
                  </Button>
                  <div />
                </Group>
              ) : null}

              <Table>
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <MarketItemRows
                    marketItems={item.marketItems}
                    setBuyOpened={setBuyOpened}
                    setCancelListingOpened={setCancelListingOpened}
                    setTargetMarketItem={setTargetMarketItem}
                  />
                </tbody>
              </Table>
            </SimpleGrid>
          </Card>
        </>
      ) : null}
    </Layout>
  )
}

export default ItemDetail

const MarketItemRows = (props: {
  marketItems: MarketItem[]
  setCancelListingOpened: (val: boolean) => void
  setBuyOpened: (val: boolean) => void
  setTargetMarketItem: (val: MarketItem) => void
}): ReactElement<any, any> => {
  const {
    marketItems,
    setCancelListingOpened,
    setBuyOpened,
    setTargetMarketItem,
  } = props
  return (
    <>
      {marketItems.map((element, index) => (
        <tr key={index}>
          <td>{element.seller}</td>
          <td>{element.amountAvailable}</td>
          <td>
            {element.price} {CURRENCY_NAME}
          </td>
          <td>
            {element.isSeller ? (
              <Group grow className={'mt-2'}>
                <Button
                  color={'red'}
                  onClick={async () => {
                    await setTargetMarketItem(element)
                    setCancelListingOpened(true)
                  }}
                >
                  Cancel Listing
                </Button>
              </Group>
            ) : (
              <Group grow className={'mt-2'}>
                <Button
                  color={'green'}
                  disabled={element.amountAvailable === 0}
                  onClick={async () => {
                    await setTargetMarketItem(element)
                    setBuyOpened(true)
                  }}
                >
                  Buy Now
                </Button>
              </Group>
            )}
          </td>
        </tr>
      ))}
    </>
  )
}

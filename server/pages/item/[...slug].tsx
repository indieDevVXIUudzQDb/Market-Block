import type { NextPage } from 'next'
import {
  Anchor,
  Button,
  Card,
  Group,
  Image,
  SimpleGrid,
  Title,
} from '@mantine/core'
import { useEffect, useState } from 'react'
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
}

export interface MarketItem extends DigitalItem {
  price: string
  itemId: number
  seller: string
  owner: string
  sold: boolean
  available: boolean
}

export const isMarketItem = (object: any): object is MarketItem => {
  return 'price' in object
}

export const isDigitalItem = (object: any): object is MarketItem => {
  const result = 'price' in object
  return !result
}

const ItemDetail: NextPage = () => {
  const router = useRouter()
  const { slug } = router.query
  // console.log({ router })
  const web3State: Web3State = useWeb3State()

  const [item, setItem] = useState<DigitalItem | MarketItem | null>()
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
              {isMarketItem(item) ? (
                <CancelListingModal
                  opened={cancelListingOpened}
                  setOpened={setCancelListingOpened}
                  onConfirmClick={cancelMarketSale}
                  item={item}
                />
              ) : null}

              {isDigitalItem(item) ? (
                <BuyModal
                  opened={buyOpened}
                  setOpened={setBuyOpened}
                  onConfirmClick={buyMarketItem}
                  item={item}
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
              <Group position={'left'}>
                <p>
                  <b>Quantiy Listed for Sale: </b>
                  <br />
                  {item.amountListed}
                </p>
              </Group>
              {!web3State.connected ? (
                <Group position={'left'} grow>
                  <Button color={'gray'}>Wallet not connected</Button>
                  <div />
                </Group>
              ) : null}

              {item &&
              isMarketItem(item) &&
              item.amountOwned &&
              item.available ? (
                <Group position={'left'} grow>
                  <Button
                    color={'yellow'}
                    onClick={() => {
                      setCancelListingOpened(true)
                    }}
                  >
                    Cancel Sale
                  </Button>
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
                    Sell
                  </Button>
                  <div />
                </Group>
              ) : null}
              {item && item.amountOwned ? (
                <Group position={'left'} grow>
                  <Button
                    color={'green'}
                    onClick={() => {
                      setApproveOpened(true)
                    }}
                  >
                    Approve for Sale
                  </Button>
                  <div />
                </Group>
              ) : null}
              {item && isMarketItem(item) && !item.amountOwned ? (
                <>
                  <Group position={'left'}>
                    <p>
                      <b>Price:</b> <br />{' '}
                      <b className={'text-3xl'}>
                        {item.price} {CURRENCY_NAME}
                      </b>
                    </p>
                  </Group>
                  <Group position={'apart'} grow className={'mt-2'}>
                    <Button
                      color={'green'}
                      disabled={!item.available}
                      onClick={() => {
                        setBuyOpened(true)
                      }}
                    >
                      Buy Now
                    </Button>
                  </Group>
                </>
              ) : null}
            </SimpleGrid>
          </Card>
        </>
      ) : null}
    </Layout>
  )
}

export default ItemDetail

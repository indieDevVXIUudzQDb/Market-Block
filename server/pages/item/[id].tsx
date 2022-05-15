import type { NextPage } from 'next'
import {
  Card,
  Group,
  SimpleGrid,
  Title,
  Image,
  Anchor,
  Button,
} from '@mantine/core'

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/MARKET.sol/Market.json'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { marketAddress, nftAddress, rpcURL } from '../../utils/config'
import axios from 'axios'
import { Layout } from '../../components/Layout'
import { useRouter } from 'next/router'
import { Prism } from '@mantine/prism'
import { CURRENCY_NAME, LOGO_URL } from '../../utils/constants'
import { useWeb3State, Web3State } from '../../hooks/useWeb3State'
import { SellModal } from '../../components/SellModal'
import { toast } from 'react-hot-toast'
import { toastConfig } from '../../utils/toastConfig'
import { JsonRpcSigner } from '@ethersproject/providers'
import Web3Modal from 'web3modal'
import { tryParsePattern } from 'next/dist/build/webpack/plugins/jsconfig-paths-plugin'
import { isNumber } from 'util'

export interface DigitalItem {
  tokenId: number
  image: string
  name: string
  description: string
  tokenUri: string
  meta: any
  isApproved: boolean
  isOwner: boolean
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

const ItemDetail: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const web3State: Web3State = useWeb3State()

  const [item, setItem] = useState<DigitalItem | MarketItem | null>()
  const [loading, setLoading] = useState<boolean>(false)
  const [sellOpened, setSellOpened] = useState(false)

  const loadMarketItem = async () => {
    let tokenId
    try {
      if (id && typeof id === 'string') {
        tokenId = parseInt(id)
      }
      if (typeof tokenId !== 'number') {
        throw new Error('tokenId is NAN')
      }
    } catch (e) {
      return
    }

    setLoading(true)
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
      setItem(marketItem)
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
      setItem(digitalItem)
    }
    setLoading(false)
  }

  const buyMarketItem = async (marketItem: MarketItem) => {
    try {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)

      const signer = provider.getSigner()
      const contract = new ethers.Contract(marketAddress, Market.abi, signer)
      const price = ethers.utils.parseUnits(
        marketItem.price.toString(),
        'ether'
      )
      const transaction = await contract.createMarketSale(marketItem.itemId, {
        value: price,
      })
      await transaction.wait()
      // console.log({ transaction })
      toast.success('Market Item Created', toastConfig)
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong', toastConfig)
    }
    loadMarketItem()
  }

  const sellItem = async (digitalItem: DigitalItem, salePrice: string) => {
    try {
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
      const marketContract = new ethers.Contract(
        marketAddress,
        Market.abi,
        signer
      )
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
      toast.success('Market Item Created', toastConfig)
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong', toastConfig)
    }
    loadMarketItem()
  }

  const cancelMarketSale = async (marketItem: MarketItem) => {
    try {
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
      const marketContract = new ethers.Contract(
        marketAddress,
        Market.abi,
        signer
      )
      const marketTransaction = await marketContract.cancelMarketItem(
        marketItem.itemId
      )
      await marketTransaction.wait()
      // console.log({ marketTransaction })
      toast.success('Market Item Created', toastConfig)
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong', toastConfig)
    }
    loadMarketItem()
  }

  const approveMarketSale = async (digitalItem: DigitalItem) => {
    try {
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
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong', toastConfig)
    }
    loadMarketItem()
  }

  useEffect(() => {
    loadMarketItem()
  }, [id, web3State.address])

  // @ts-ignore
  return (
    <Layout web3State={web3State}>
      {!loading && !item ? (
        <p>Item not found=</p>
      ) : !loading && item ? (
        <>
          {item ? (
            <SellModal
              opened={sellOpened}
              setOpened={setSellOpened}
              onSellClick={sellItem}
              item={item}
            />
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
                        src={LOGO_URL}
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
              eslint-disable-next-line no-nested-ternary
              {!web3State.connected ? (
                <Group position={'left'} grow>
                  <Button color={'gray'}>Wallet not connected</Button>
                  <div />
                </Group>
              ) : /* eslint-disable-next-line no-nested-ternary */
              item && isMarketItem(item) && item.isOwner && item.available ? (
                <Group position={'left'} grow>
                  <Button
                    color={'yellow'}
                    onClick={() => {
                      cancelMarketSale(item)
                    }}
                  >
                    Cancel Sale
                  </Button>
                  <div />
                </Group>
              ) : // eslint-disable-next-line no-nested-ternary
              item && isMarketItem(item) && item.isOwner && item.isApproved ? (
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
              ) : // eslint-disable-next-line no-nested-ternary
              item && item.isOwner ? (
                <Group position={'left'} grow>
                  <Button
                    color={'green'}
                    onClick={() => {
                      approveMarketSale(item)
                    }}
                  >
                    Approve for Sale
                  </Button>
                  <div />
                </Group>
              ) : item && isMarketItem(item) && !item.isOwner ? (
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
                        buyMarketItem(item)
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

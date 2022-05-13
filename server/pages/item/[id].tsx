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
import Web3Modal from 'web3modal'
import { MarketItemCard } from '../../components/MarketItemCard'
import { useRouter } from 'next/router'
import { Prism } from '@mantine/prism'
import { CURRENCY_NAME } from '../../utils/constants'
import { useWeb3State, Web3State } from '../../hooks/useWeb3State'

export interface MarketItem {
  price: string
  itemId: number
  seller: string
  owner: string
  image: string
  name: string
  description: string
  tokenUri: string
  isOwner: boolean
  available: boolean
  isApproved: boolean
  meta: any
}

const Home: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const web3State: Web3State = useWeb3State()

  const [marketItem, setMarketItem] = useState<MarketItem | null>()
  const [loading, setLoading] = useState<boolean>(false)

  const loadMarketItem = async (id: number) => {
    setLoading(true)
    const provider = new ethers.providers.JsonRpcProvider(rpcURL)
    // const web3Modal = new Web3Modal()
    // setConnected(web3Modal.)
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(
      marketAddress,
      Market.abi,
      provider
    )
    const data = await marketContract.fetchMarketItem(id)

    const tokenUri = await tokenContract.tokenURI(data.tokenId)
    const meta = await axios.get(tokenUri)
    let price = ethers.utils.formatUnits(data.price.toString(), 'ether')
    const item: MarketItem = {
      price,
      itemId: data.itemId.toNumber() as number,
      seller: data.seller as string,
      owner: data.owner as string,
      image: meta.data.image as string,
      name: meta.data.name as string,
      description: meta.data.description as string,
      tokenUri,
      //TODO
      isOwner: false,
      available: true,
      isApproved: false,
      meta,
    }
    console.log({ item })

    setMarketItem(item)
    setLoading(false)
  }
  useEffect(() => {
    try {
      console.log({ id })
      if (id && typeof id === 'string') {
        const marketId = parseInt(id)
        loadMarketItem(marketId)
      }
    } catch (e) {
      console.error(e)
    }
  }, [id])

  return (
    <Layout web3State={web3State}>
      {!loading && !marketItem ? (
        <p>Item not found=</p>
      ) : !loading && marketItem ? (
        <Card
          shadow="sm"
          p="lg"
          style={{
            margin: '3em',
            marginLeft: '3em',
            minHeight: '90%',
            // borderRadius: " 30px",
          }}
        >
          <SimpleGrid cols={1}>
            <Group position="center" style={{ marginBottom: 5 }}>
              <Title align={'center'}>{marketItem.name}</Title>
            </Group>
            <Card.Section>
              <div style={{ textAlign: 'center' }}>
                <Image
                  src={marketItem.image}
                  height={160}
                  alt="Norway"
                  fit="contain"
                  withPlaceholder
                  placeholder={
                    <Image
                      src={`http://localhost:3000/logoipsum-logo-39.svg`}
                      height={160}
                      alt="Norway"
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
                {marketItem.description}
              </p>
            </Group>
            <Group position={'left'}>
              <p>
                <b>URL: </b>
                <br />
                <Anchor href={marketItem.tokenUri} target="_blank">
                  {marketItem.tokenUri}
                </Anchor>
              </p>
            </Group>
            <Group position={'left'} grow>
              <b>Meta Data: </b>
            </Group>
            <Group position={'left'} grow>
              <Prism language={'json'} color={'blue'}>
                {JSON.stringify(marketItem.meta.data)}
              </Prism>
            </Group>
            eslint-disable-next-line no-nested-ternary
            {!web3State.connected ? (
              <Group position={'left'} grow>
                <Button color={'gray'}>Wallet not connected</Button>
                <div />
              </Group>
            ) : /* eslint-disable-next-line no-nested-ternary */
            marketItem.isOwner && marketItem && marketItem.available ? (
              <Group position={'left'} grow>
                <Button
                  color={'yellow'}
                  onClick={() => {
                    //TODO
                    // setOpened(true);
                  }}
                >
                  Cancel Sale
                </Button>
                <div />
              </Group>
            ) : // eslint-disable-next-line no-nested-ternary
            marketItem.isOwner && marketItem.isApproved ? (
              <Group position={'left'} grow>
                <Button
                  onClick={() => {
                    //TODO
                    // setOpened(true)
                  }}
                >
                  Sell
                </Button>
                <div />
              </Group>
            ) : // eslint-disable-next-line no-nested-ternary
            marketItem.isOwner ? (
              <Group position={'left'} grow>
                <Button
                  color={'green'}
                  onClick={() => {
                    //TODO
                    // approveSellNFT(marketItem)
                  }}
                >
                  Approve for Sale
                </Button>
                <div />
              </Group>
            ) : marketItem && !marketItem.isOwner ? (
              <>
                <Group position={'left'}>
                  <p>
                    <b>Price:</b> <br />{' '}
                    <b className={'text-3xl'}>
                      {marketItem.price} {CURRENCY_NAME}
                    </b>
                  </p>
                </Group>
                <Group position={'apart'} grow className={'mt-2'}>
                  <Button
                    color={'green'}
                    disabled={!marketItem?.available}
                    onClick={() => {
                      //TODO
                      // processSale(marketItem)
                    }}
                  >
                    Buy Now
                  </Button>
                </Group>
              </>
            ) : null}
          </SimpleGrid>
        </Card>
      ) : null}
      <div style={{ minHeight: '1000px' }}></div>
    </Layout>
  )
}

export default Home

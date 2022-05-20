import nextConnect from 'next-connect'
import { ethers } from 'ethers'
import { rpcURL } from '../../../utils/constants/config'
import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../artifacts/contracts/MARKET.sol/Market.json'
import { filter } from '../../../utils/helpers/common'
import { marketAddress } from '../../../utils/constants/contracts'
import { Market as IMarket, NFT as INFT } from '../../../types'

const models = require('../../../db/models/index')

const handler = nextConnect()
  // Get method
  .get(async (req, res) => {
    const {
      // @ts-ignore
      query: { nextPage, queryAddress },
    } = req
    const limit = 20
    const assets = await models.assets.findAndCountAll({
      attributes: {
        exclude: [],
      },
      order: [['id', 'DESC']],
    })

    const ownedAssets = await filter(
      assets.rows,
      async (asset: { tokenAddress: string; tokenId: any }) => {
        const provider = new ethers.providers.JsonRpcProvider(rpcURL)
        const tokenContract: INFT = new ethers.Contract(
          asset.tokenAddress,
          NFT.abi,
          provider
        ) as INFT
        const marketContract: IMarket = new ethers.Contract(
          marketAddress,
          Market.abi,
          provider
        ) as IMarket
        const marketItem = await marketContract.fetchMarketItemByTokenId(
          asset.tokenId
        )
        let owner,
          isOwner = false
        if (marketItem && marketItem.status === 0) {
          owner = marketItem.seller
          isOwner = owner.toLowerCase() === queryAddress.toLowerCase()
        } else {
          let balanceResult
          if (queryAddress) {
            balanceResult = await tokenContract.balanceOf(
              queryAddress,
              asset.tokenId
            )
          }
          if (balanceResult) {
            let balance = balanceResult.toNumber()
            isOwner = balance > 0
          }
        }
        // console.log('owner', owner, 'address', queryAddress)
        return isOwner
      }
    )

    res.statusCode = 200
    // @ts-ignore
    res.json({
      status: 'success',
      data: ownedAssets,
      total: ownedAssets.length,
      //  TODO
      nextPage: +nextPage + limit,
    })
  })

export default handler

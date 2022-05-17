import nextConnect from 'next-connect'
import { ethers } from 'ethers'
import { rpcURL } from '../../../utils/constants/config'
import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../artifacts/contracts/MARKET.sol/Market.json'
import { filter } from '../../../utils/helpers/common'
import { marketAddress } from '../../../utils/constants/contracts'

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
        const tokenContract = new ethers.Contract(
          asset.tokenAddress,
          NFT.abi,
          provider
        )
        const marketContract = new ethers.Contract(
          marketAddress,
          Market.abi,
          provider
        )
        const marketItem = await marketContract.fetchMarketItemByTokenId(
          asset.tokenId
        )
        let owner
        if (marketItem && marketItem.status === 0) {
          owner = marketItem.seller
        } else {
          owner = await tokenContract.ownerOf(asset.tokenId)
        }
        console.log('owner', owner, 'address', queryAddress)
        console.log(owner.toLowerCase() === queryAddress.toLowerCase())
        return owner.toLowerCase() === queryAddress.toLowerCase()
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

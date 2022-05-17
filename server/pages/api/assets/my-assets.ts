import nextConnect from 'next-connect'
import { ethers } from 'ethers'
import { marketAddress, nftAddress, rpcURL } from '../../../utils/config'
import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../artifacts/contracts/MARKET.sol/Market.json'

const models = require('../../../db/models/index')

// The helper function
async function filter(arr: any[], callback: any): Promise<any[]> {
  const fail = Symbol()
  return (
    await Promise.all(
      arr.map(async (item) => ((await callback(item)) ? item : fail))
    )
  ).filter((i) => i !== fail)
}

const handler = nextConnect()
  // Get method
  .get(async (req, res) => {
    const {
      // @ts-ignore
      query: { nextPage, address },
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
      async (asset: { address: string; tokenId: any }) => {
        const provider = new ethers.providers.JsonRpcProvider(rpcURL)
        const tokenContract = new ethers.Contract(
          asset.address,
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
        console.log('owner', owner, 'address', address)
        console.log(owner.toLowerCase() === address.toLowerCase())
        return owner.toLowerCase() === address.toLowerCase()
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

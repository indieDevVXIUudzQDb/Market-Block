import nextConnect from 'next-connect'
import { DigitalItem } from '../../item/[...slug]'
import { loadMarketItemsUtil } from '../../../utils/helpers/marketHelpers'
import { Web3State } from '../../../hooks/useWeb3State'

const models = require('../../../db/models/index')

const handler = nextConnect()
  // Get method
  .get(async (req, res) => {
    const {
      // @ts-ignore
      query: { nextPage, queryAddress },
    } = req
    const assets = await models.assets.findAndCountAll({
      attributes: {
        exclude: [],
      },
      order: [['id', 'DESC']],
    })
    const web3State: Web3State = {
      address: queryAddress,
      connected: true,
      provider: undefined,
      connectWallet: function (): Promise<void> {
        throw new Error('Function not implemented.')
      },
      web3Modal: undefined,
    }
    const items: DigitalItem[] = await loadMarketItemsUtil(
      assets.rows,
      web3State
    )
    const ownedAssets = items.filter((item) => item.amountOwned > 0)
    const ownedAssetIds = ownedAssets.map((asset) => {
      return { tokenId: asset.tokenId, tokenAddress: asset.tokenAddress }
    })

    res.statusCode = 200
    // @ts-ignore
    res.json({
      status: 'success',
      data: ownedAssetIds,
      total: ownedAssetIds.length,
    })
  })

export default handler

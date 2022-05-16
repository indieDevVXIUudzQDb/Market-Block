import nextConnect from 'next-connect'

const models = require('../../../db/models/index')

const handler = nextConnect()
  // Get method
  .get(async (req, res) => {
    const {
      // @ts-ignore
      query: { nextPage },
    } = req
    const limit = 20
    const assets = await models.assets.findAndCountAll({
      attributes: {
        exclude: [],
      },
      order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ['id', 'DESC'],
      ],
      offset: nextPage ? +nextPage : 0,
      limit,
    })

    res.statusCode = 200
    // @ts-ignore
    res.json({
      status: 'success',
      data: assets.rows,
      total: assets.count,
      nextPage: +nextPage + limit,
    })
  })

export default handler

import nextConnect from 'next-connect'

const models = require('../../../db/models/index')

const handler = nextConnect()
  // Get method
  .get(async (req, res) => {
    const {
      // @ts-ignore
      query: { nextPage },
    } = req
    const assets = await models.assets.findAndCountAll({
      attributes: {
        exclude: [],
      },
      order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ['id', 'DESC'],
      ],
    })

    res.statusCode = 200
    // @ts-ignore
    res.json({
      status: 'success',
      data: assets.rows,
      total: assets.count,
    })
  })

export default handler

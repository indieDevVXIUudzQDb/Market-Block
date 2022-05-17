import nextConnect from 'next-connect'
const models = require('../../../db/models/index')

const handler = nextConnect()
  // Get method
  .get(async (req, res) => {
    const {
      // @ts-ignore
      query: { slug },
    } = req
    const asset = await models.assets.findOne({
      where: {
        slug: slug,
      },
      include: [],
    })
    res.statusCode = 200
    // @ts-ignore
    return res.json({ status: 'success', data: asset })
  })
  // Post method
  .post(async (req, res) => {
    const {
      // @ts-ignore
      body,
    } = req
    const { tokenAddress, tokenId } = body
    let status = 'success',
      statusCode = 200,
      error = '',
      newAsset = {}

    try {
      newAsset = await models.assets.create({
        tokenAddress,
        tokenId,
      })
    } catch (err) {
      /* Sql error number */
      statusCode = 500
      // @ts-ignore

      error = err.original.errno && 'Not available right now'
      status = 'error'
    }
    // @ts-ignore
    return res.status(statusCode).json({
      status,
      error,
      message: 'done',
      data: newAsset,
    })
  })
  // Put method
  .put(async (req, res) => {
    res.end('method - put')
  })
  // Patch method
  .patch(async (req, res) => {
    throw new Error('Throws me around! Error can be caught and handled.')
  })

export default handler

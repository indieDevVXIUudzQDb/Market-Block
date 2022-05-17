import { useState } from 'react'
import { useForm } from '@mantine/form'
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Group,
  MantineTheme,
  Progress,
  Space,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core'
import {
  Files,
  Icon as TablerIcon,
  Photo,
  Trash,
  Upload,
  X,
} from 'tabler-icons-react'
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone'

import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { Layout } from '../components/Layout'
import { ipfsAPIURL, ipfsFileURL } from '../utils/constants/config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/MARKET.sol/Market.json'
import { toast } from 'react-hot-toast'
import { toastConfig } from '../utils/constants/toastConfig'
import { readFileAsync } from '../utils/utils'
import { useWeb3State, Web3State } from '../hooks/useWeb3State'
import { CURRENCY_NAME } from '../utils/constants/constants'
import { absoluteUrl } from '../middleware/utils'
import { marketAddress, nftAddress } from '../utils/constants/contracts'

const client = ipfsHttpClient({ url: `${ipfsAPIURL}` })

const CreateItem: (props: { baseApiUrl: string }) => JSX.Element = (props: {
  baseApiUrl: string
}) => {
  const { baseApiUrl } = props
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadFilename, setUploadFilename] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [files, setFiles] = useState<(Blob | MediaSource)[]>([])
  const [imageFile, setImageFile] = useState<Blob | MediaSource | null>()
  const [fileArrayBuffers, setFileArrayBuffers] = useState<ArrayBuffer[]>([])
  const [imageArrayBuffer, setImageArrayBuffer] = useState<ArrayBuffer>(
    new ArrayBuffer(0)
  )
  const [imagePreview, setImagePreview] = useState<string | null>()
  const theme = useMantineTheme()
  const web3State: Web3State = useWeb3State()

  const form = useForm({
    initialValues: {
      name: 'Test',
      description: 'test description',
      price: '100',
      listForSale: true,
    },
  })
  const getIconColor = (status: DropzoneStatus, theme: MantineTheme) => {
    return status.accepted
      ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
      : status.rejected
      ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
      : theme.colorScheme === 'dark'
      ? theme.colors.dark[0]
      : theme.colors.gray[7]
  }

  function ImageUploadIcon({
    status,
    ...props
  }: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
    if (status.accepted) {
      return <Upload {...props} />
    }

    if (status.rejected) {
      return <X {...props} />
    }

    return <Photo {...props} />
  }

  const dropzoneImageChildren = (
    status: DropzoneStatus,
    theme: MantineTheme
  ) => (
    <Group
      position="center"
      spacing="xl"
      style={{ minHeight: 220, pointerEvents: 'none' }}
    >
      <ImageUploadIcon
        status={status}
        style={{ color: getIconColor(status, theme) }}
        size={80}
      />
      <div>
        <Text size="xl" inline>
          Drag image here or click to select file
        </Text>
      </div>
    </Group>
  )

  const dropzoneFileChildren = (
    status: DropzoneStatus,
    theme: MantineTheme
  ) => (
    <Group
      position="center"
      spacing="xl"
      style={{ minHeight: 220, pointerEvents: 'none' }}
    >
      <Files style={{ color: getIconColor(status, theme) }} size={80} />
      <div>
        <Text size="xl" inline>
          Drag files here or click to select files
        </Text>
      </div>
    </Group>
  )

  const onDrop = async (
    droppedFiles: (Blob | MediaSource)[],
    image: boolean
  ) => {
    if (image) {
      const file = droppedFiles[0]
      setImageFile(file)
      const bytes = await readFileAsync(file as Blob)
      setImageArrayBuffer(bytes)
      setImagePreview(URL.createObjectURL(file))
    } else {
      const addedFiles = [...files, ...droppedFiles]
      setFiles(addedFiles)
      const fileByteArrays = await Promise.all(
        droppedFiles.map(async (f) => {
          const bytes = await readFileAsync(f as Blob)
          return bytes
        })
      )
      const addedFileArrayBuffers = [...fileArrayBuffers, ...fileByteArrays]
      setFileArrayBuffers(addedFileArrayBuffers)
    }
  }

  const createItem = async (formValues: {
    name?: string
    description?: string
    listForSale?: boolean
    price?: string
  }) => {
    const { name, description, price, listForSale } = formValues
    const fileCount = fileArrayBuffers.length + 1
    let signer
    try {
      // @ts-ignore
      try {
        await web3State.connectWallet()
        // @ts-ignore
        signer = web3State.provider.getSigner()
        signer.getAddress()
      } catch (e) {
        throw new Error('Wallet not ready or not available')
      }
      // Image to IPFS
      await setUploadingImage(true)
      const imageAdded = await client.add(imageArrayBuffer, {
        progress: async (p) => {
          // @ts-ignore
          setUploadFilename(imageFile.name)
          // @ts-ignore
          let max = imageFile.size
          // @ts-ignore
          const updatedProgress = uploadProgress + (p / max) * 100

          console.log({
            p,
            max,
            updatedProgress,
          })
          await setUploadProgress(updatedProgress)
          console.log(`Recieved: ${p}`)
        },
      })
      await setUploadingImage(false)
      console.log({ imageAdded })

      const imageURL = `${ipfsFileURL}${imageAdded.cid}`
      await setUploadingFiles(true)
      const fileUrls = await Promise.all(
        fileArrayBuffers?.map(async (f, index) => {
          setUploadProgress(0)
          const fileAdded = await client.add(f, {
            progress: async (p) => {
              // @ts-ignore
              let max = files[index].size
              // @ts-ignore
              setUploadFilename(files[index].name)

              // @ts-ignore
              const updatedProgress = uploadProgress + (p / max) * 100

              console.log({
                p,
                max,
                updatedProgress,
              })
              await setUploadProgress(updatedProgress)
              console.log(`Recieved: ${p}`)
            },
          })
          await setUploadProgress(100)
          setUploadFilename('Upload Complete')
          console.log({ fileAdded })
          return `${ipfsFileURL}${fileAdded.cid}`
        })
      )
      await setUploadingFiles(false)

      const data = {
        name,
        description,
        image: imageURL,
        files: fileUrls,
      }
      console.log({ data })

      const dataAdded = await client.add(JSON.stringify(data), {
        //TODO show progress modal
        progress: (p) => console.log(`Recieved: ${p}`),
      })
      const ipfsURL = `${ipfsFileURL}${dataAdded.path}`
      console.log({ ipfsURL })

      // Create NFT
      const contract = new ethers.Contract(nftAddress, NFT.abi, signer)
      const nftTransaction = await contract.createToken(ipfsURL)
      const nftTx = await nftTransaction.wait()

      const event = nftTx.events[0]
      const value = event.args[2]
      const tokenId = value.toNumber()
      console.log({ tokenId })

      const jobApi = await fetch(`${baseApiUrl}/assets/[slug]`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenId,
          address: nftAddress,
        }),
      })

      let result = await jobApi.json()
      if (
        result.status === 'success' &&
        result.message &&
        result.message === 'done' &&
        result.data
      ) {
        toast.success('Item Created Successfully', toastConfig)
      } else {
        toast.error('Something went wrong', toastConfig)
      }

      if (listForSale) {
        // @ts-ignore
        await createMarketItem(tokenId, price)
      }
    } catch (e) {
      // @ts-ignore
      if (e.message === 'Wallet not ready or not available') {
        // @ts-ignore
        toast.error(e.message, toastConfig)
      }
      console.error(e)
    }
  }

  const createMarketItem = async (tokenId: string, salePrice: string) => {
    try {
      console.log('createMarketItem called', tokenId)
      // @ts-ignore
      const signer = web3State.provider.getSigner()
      //Create Market Item
      const price = ethers.utils.parseUnits(salePrice, 'ether')
      const marketContract = new ethers.Contract(
        marketAddress,
        Market.abi,
        signer
      )
      const listPriceResult = await marketContract.getListingPrice()
      const listingPrice = listPriceResult.toString()
      // console.log({ tokenId, price, listingPrice, salePrice })
      const marketTransaction = await marketContract.createMarketItem(
        nftAddress,
        tokenId,
        price,
        { value: listingPrice }
      )
      await marketTransaction.wait()
      console.log({ marketTransaction })
      toast.success('Market Item Listed Successfully', toastConfig)
      resetPage()
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong', toastConfig)
    }
  }
  const resetPage = () => {
    form.reset()
    setFiles([])
    setImagePreview(null)
    setImageFile(null)
  }

  return (
    <Layout web3State={web3State}>
      <Box sx={{ maxWidth: 800 }} mx="auto">
        <form onSubmit={form.onSubmit((values) => createItem(values))}>
          <TextInput required label="Name" {...form.getInputProps('name')} />
          <TextInput
            required
            label="Description"
            {...form.getInputProps('description')}
          />
          <TextInput
            required
            label={`Asking Price (${CURRENCY_NAME})`}
            type={'number'}
            {...form.getInputProps('price')}
          />
          <Checkbox
            mt="md"
            label="List for sale"
            {...form.getInputProps('listForSale', { type: 'checkbox' })}
          />
          <Text>
            Image <span className={'text-red-400'}>*</span>
          </Text>
          {imagePreview ? (
            <Group>
              {/*@ts-ignore */}
              {imageFile && imageFile.name ? (
                // @ts-ignore
                <Text>{imageFile.name}</Text>
              ) : null}
              <ActionIcon
                onClick={() => {
                  setImageFile(null)
                  setImagePreview(null)
                }}
              >
                <Trash />
              </ActionIcon>
              {imagePreview ? <img src={imagePreview} /> : null}
            </Group>
          ) : (
            <Dropzone
              className={'mt-5 mb-5'}
              onDrop={(files) => onDrop(files, true)}
              onReject={(files) => console.log('rejected files', files)}
              maxSize={3 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
              loading={uploadingImage}
            >
              {(status) => dropzoneImageChildren(status, theme)}
            </Dropzone>
          )}

          <Text>
            Files <span className={'text-red-400'}>*</span>
          </Text>
          {files.map((file, index) => {
            return (
              <Group key={index}>
                {/*@ts-ignore*/}
                <Text>{file.name}</Text>
                <ActionIcon
                  onClick={() => {
                    let remainingFiles = [...files]
                    remainingFiles.splice(index, 1)
                    setFiles(remainingFiles)
                  }}
                >
                  <Trash />
                </ActionIcon>
              </Group>
            )
          })}
          <Dropzone
            className={'mt-5 mb-5'}
            onDrop={(files) => onDrop(files, false)}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={3 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            loading={uploadingFiles}
          >
            {(status) => dropzoneFileChildren(status, theme)}
          </Dropzone>
          <Group grow={true} p={10}>
            {uploadFilename ? (
              <Progress
                value={uploadProgress}
                label={uploadFilename || ''}
                size="xl"
                radius="xl"
                color={'violet'}
              />
            ) : null}
          </Group>
          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
        <Space />
      </Box>
    </Layout>
  )
}

/* getServerSideProps */
export async function getServerSideProps(context: { query: any; req: any }) {
  const { query, req } = context
  const { origin } = absoluteUrl(req)

  const baseApiUrl = `${origin}/api`

  return {
    props: {
      origin,
      baseApiUrl,
    },
  }
}

export default CreateItem

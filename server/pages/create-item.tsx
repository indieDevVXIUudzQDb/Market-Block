import { useState } from 'react'
import { useForm } from '@mantine/form'
import {
  Box,
  Button,
  Group,
  TextInput,
  Text,
  useMantineTheme,
  MantineTheme,
  ActionIcon,
} from '@mantine/core'
import {
  Upload,
  Photo,
  X,
  Icon as TablerIcon,
  Files,
  Trash,
} from 'tabler-icons-react'
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone'

import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import { NextPage } from 'next'
import { Layout } from './Layout'
import {
  ipfsAPIURL,
  ipfsFileURL,
  marketAddress,
  nftAddress,
} from '../utils/config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/MARKET.sol/Market.json'
import { toast } from 'react-hot-toast'
import { toastConfig } from '../utils/toastConfig'
import { readFileAsync } from '../utils/utils'

const client = ipfsHttpClient({ url: `${ipfsAPIURL}` })

const CreateItem: NextPage = () => {
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

  const form = useForm({
    initialValues: {
      name: 'Test',
      description: 'test description',
      price: '100',
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
    console.log(files)
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
    price?: string
  }) => {
    const { name, description, price } = formValues
    try {
      // Image to IPFS
      await setUploadingImage(true)
      const imageAdded = await client.add(imageArrayBuffer, {
        progress: (p) => console.log(`Recieved: ${p}`),
      })
      await setUploadingImage(false)
      console.log({ imageAdded })

      const imageURL = `${ipfsFileURL}${imageAdded.cid}`
      await setUploadingFiles(true)
      const fileUrls = await Promise.all(
        fileArrayBuffers?.map(async (f) => {
          const fileAdded = await client.add(f, {
            progress: (p) => console.log(`Recieved: ${p}`),
          })
          console.log({ fileAdded })
          return `${ipfsFileURL}${fileAdded.cid}`
        })
      )
      await setUploadingFiles(false)

      const data = {
        name,
        description,
        price,
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
      createMarketItem(ipfsURL, price as string)
    } catch (e) {
      console.error(e)
    }
  }

  const createMarketItem = async (url: string, salePrice: string) => {
    try {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      // Create NFT
      const contract = new ethers.Contract(nftAddress, NFT.abi, signer)
      const nftTransaction = await contract.createToken(url)
      const nftTx = await nftTransaction.wait()

      const event = nftTx.events[0]
      const value = event.args[2]
      const tokenId = value.toNumber()
      console.log({ tokenId, value })
      //Create Market Item
      const price = ethers.utils.parseUnits(salePrice, 'ether')
      const marketContract = new ethers.Contract(
        marketAddress,
        Market.abi,
        signer
      )
      const listPriceResult = await marketContract.getListingPrice()
      const listingPrice = listPriceResult.toString()
      console.log({ tokenId, price, listingPrice, salePrice })
      const marketTransaction = await marketContract.createMarketItem(
        nftAddress,
        tokenId,
        price,
        { value: listingPrice }
      )
      await marketTransaction.wait()

      toast.success('Market Item Created', toastConfig)
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
    <Layout>
      <Box sx={{ maxWidth: 800 }} mx="auto">
        <form onSubmit={form.onSubmit((values) => createItem(values))}>
          <TextInput required label="Name" {...form.getInputProps('name')} />
          <TextInput
            required
            label="Description"
            {...form.getInputProps('description')}
          />
          <TextInput required label="Price" {...form.getInputProps('price')} />
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
          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Box>
    </Layout>
  )
}

export default CreateItem

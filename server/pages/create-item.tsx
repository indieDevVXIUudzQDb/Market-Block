import { useRef, useState } from 'react'
import { useForm } from '@mantine/form'
import {
  ActionIcon,
  Alert,
  Anchor,
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
  AlertCircle,
  Files,
  Icon as TablerIcon,
  Photo,
  Trash,
  Upload,
  X,
} from 'tabler-icons-react'
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { Layout } from '../components/Layout'
import { ipfsAPIURL, ipfsFileURL } from '../utils/constants/config'
import { toast } from 'react-hot-toast'
import { toastConfig } from '../utils/constants/toastConfig'
import { readFileAsync } from '../utils/utils'
import { useWeb3State, Web3State } from '../hooks/useWeb3State'
import { CURRENCY_NAME } from '../utils/constants/constants'
import { absoluteUrl } from '../middleware/utils'
import {
  activeSigner,
  createAssetUtil,
  createMarketListingUtil,
} from '../utils/helpers/marketHelpers'

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
  const [imageArrayBuffer, setImageArrayBuffer] = useState<ArrayBuffer | null>(
    null
  )
  const [imagePreview, setImagePreview] = useState<string | null>()
  const theme = useMantineTheme()
  const web3State: Web3State = useWeb3State()
  const listItemCheckboxRef = useRef<HTMLInputElement>()
  const ipfsAwareCheckboxRef = useRef<HTMLInputElement>()

  const form = useForm({
    initialValues: {
      name: 'Test',
      description: 'test description',
      price: '100',
      listForSale: true,
      ipfsAware: false,
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

  const createAsset = async (formValues: {
    name?: string
    description?: string
    listForSale?: boolean
    price?: string
    ipfsAware: boolean
  }) => {
    if (!formValues.ipfsAware) return
    try {
      const { name, description, price, listForSale } = formValues
      const signer = await activeSigner(web3State)
      let imageURL
      if (imageArrayBuffer) {
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
        imageURL = `${ipfsFileURL}${imageAdded.cid}`
      }

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
        progress: (p) => console.log(`Recieved: ${p}`),
      })
      const ipfsURL = `${ipfsFileURL}${dataAdded.path}`
      console.log({ ipfsURL })

      const tokenId = await createAssetUtil(ipfsURL, signer, baseApiUrl)
      if (tokenId) {
        toast.success('Item Created Successfully', toastConfig)
      } else {
        toast.error('Something went wrong', toastConfig)
      }

      if (listForSale) {
        await createMarketListing(tokenId, price || '0')
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

  const createMarketListing = async (tokenId: string, salePrice: string) => {
    try {
      console.log('createMarketItem called', tokenId)
      const signer = await activeSigner(web3State)
      //Create Market Item
      const created = await createMarketListingUtil(tokenId, salePrice, signer)
      if (created) {
        toast.success('Market Item Listed Successfully', toastConfig)
      } else {
        throw new Error('Something went wrong')
      }
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
      <Box
        sx={{
          maxWidth: 600,
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          // textAlign: 'center',
          padding: theme.spacing.xl,
          borderRadius: theme.radius.md,
          cursor: 'pointer',
          marginBottom: '20%',
        }}
        mx="auto"
      >
        <form onSubmit={form.onSubmit((values) => createAsset(values))}>
          <TextInput
            className={'mb-5'}
            required
            label={<b>Name</b>}
            {...form.getInputProps('name')}
          />
          <TextInput
            className={'mb-5'}
            required
            label={<b>Description</b>}
            {...form.getInputProps('description')}
          />
          <Group className={'pb-5'}>
            <Alert
              icon={<AlertCircle size={16} />}
              title="List for sale"
              color="green"
            >
              <Checkbox
                mt="md"
                label=" Once listed, this item will show up for sale. It is possible to
            cancel the item listing, but any copies already sold will still
            exist in the respective addresses."
                color="green"
                // @ts-ignore
                ref={listItemCheckboxRef}
                {...form.getInputProps('listForSale', { type: 'checkbox' })}
              />
            </Alert>
          </Group>
          {listItemCheckboxRef.current?.checked ? (
            <>
              <TextInput
                required
                label={<b>{`Asking Price (${CURRENCY_NAME})`}</b>}
                type={'number'}
                {...form.getInputProps('price')}
              />
            </>
          ) : null}
          <Text className={'mt-5'}>
            <b>Image</b>
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
            <b>Files</b>
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
          <Group>
            <Alert
              icon={<AlertCircle size={16} />}
              title="Upload to IPFS"
              color="yellow"
            >
              <Checkbox
                label={
                  'I understand the selected picture, and files will be stored in IPFS and a link will be stored on the blockchain. ' +
                  'IPFS is a distributed system for storing and accessing files, websites, applications, and data.'
                }
                mt="md"
                color="yellow"
                // @ts-ignore
                ref={ipfsAwareCheckboxRef}
                {...form.getInputProps('ipfsAware', { type: 'checkbox' })}
              />
              &nbsp;{' '}
              <Anchor href={'https://docs.ipfs.io/concepts/what-is-ipfs/'}>
                Learn More
              </Anchor>
            </Alert>
          </Group>
          <Group position="right" mt="md">
            <Button
              type="submit"
              disabled={!ipfsAwareCheckboxRef.current?.checked}
            >
              Create
            </Button>
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

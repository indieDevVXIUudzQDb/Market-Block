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
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { NextPage } from 'next'
import { Layout } from './Layout'
import { ImportCandidate } from 'ipfs-core-types/src/utils'
import { ipfsAPIURL, ipfsFileURL } from '../utils/config'

const client = ipfsHttpClient({ url: `${ipfsAPIURL}` })

const CreateItem: NextPage = () => {
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [files, setFiles] = useState<ImportCandidate[]>([])
  const [imageFile, setImageFile] = useState<ImportCandidate | null>()
  const [imagePreview, setImagePreview] = useState<string | null>()
  const router = useRouter()
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

  const onDrop = async (droppedFiles: any, image: boolean) => {
    console.log(files)
    if (image) {
      await setImageFile(droppedFiles[0])
      // @ts-ignore
      setImagePreview(URL.createObjectURL(droppedFiles[0]))
    } else {
      //TODO deletable files
      const addedFiles = [...files, ...droppedFiles]
      await setFiles(addedFiles)
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
      const imageAdded = await client.add(imageFile as ImportCandidate, {
        progress: (p) => console.log(`Recieved: ${p}`),
      })
      await setUploadingImage(false)
      console.log({ imageAdded })

      const image = `${ipfsFileURL}${imageAdded.path}`
      await setUploadingFiles(true)
      const fileUrls = await Promise.all(
        files?.map(async (f) => {
          const fileAdded = await client.add(f, {
            progress: (p) => console.log(`Recieved: ${p}`),
          })
          console.log({ fileAdded })
          return `${ipfsFileURL}${fileAdded.path}`
        })
      )
      await setUploadingFiles(false)

      const data = {
        name,
        description,
        price,
        image,
        files: fileUrls,
      }
      console.log({ data })
    } catch (e) {
      console.error(e)
    }
  }

  // @ts-ignore
  // @ts-ignore
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
          {imageFile ? (
            <Group>
              {/* @ts-ignore */}
              {imageFile.name ? <Text>{imageFile.name}</Text> : null}
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

import { Button, Group, Header, Title } from '@mantine/core'
import { toast, Toaster } from 'react-hot-toast'
import { useClipboard } from '@mantine/hooks'
import { Wallet } from 'tabler-icons-react'
import { addressShortener } from '../utils/utils'
import { toastConfig } from '../utils/toastConfig'
import { SITE_NAME } from '../utils/constants'
import { NavLinks } from './NavLinks'
import { Web3State } from '../hooks/useWeb3State'

export const SiteHeader = (props: { web3State: Web3State }) => {
  const clipboard = useClipboard({ timeout: 500 })
  const { address, connectWallet } = props.web3State

  return (
    <Header height={120} p="md">
      <div>
        <Toaster />
      </div>

      <Group position={'apart'}>
        <div></div>
        <div>
          <Title className={'text-white'}>{SITE_NAME}</Title>
        </div>
        {address ? (
          <Button
            color={clipboard.copied ? 'lime' : 'indigo'}
            onClick={() => {
              clipboard.copy(address)
              toast.success('Address copied to clipboard!', toastConfig)
            }}
          >
            <Wallet size={16} /> &nbsp; {addressShortener(address, 4)}
          </Button>
        ) : (
          <Button
            color={'blue'}
            variant={'outline'}
            onClick={() => connectWallet()}
          >
            Connect Wallet
          </Button>
        )}
      </Group>
      <Group className={'p-3'}>
        <NavLinks />
      </Group>
    </Header>
  )
}

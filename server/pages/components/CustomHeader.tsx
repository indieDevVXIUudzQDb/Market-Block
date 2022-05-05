import { Button, Group, Header, Title } from '@mantine/core'
import { useWeb3 } from '@3rdweb/hooks'
import { toast, Toaster } from 'react-hot-toast'
import { useClipboard } from '@mantine/hooks'
import { Wallet } from 'tabler-icons-react'
import { addressShortener } from '../../utils/utils'
import { toastConfig } from '../../utils/toastConfig'
import { MARKET_NAME } from '../../utils/constants'

export const CustomHeader = () => {
  const { connectWallet, address, error } = useWeb3()
  const clipboard = useClipboard({ timeout: 500 })

  return (
    <Header height={80} p="md">
      <div>
        <Toaster />
      </div>

      <Group position={'apart'}>
        <div></div>
        <div>
          <Title className={'text-white'}>{MARKET_NAME}</Title>
        </div>
        {address ? (
          <Button
            color={clipboard.copied ? 'lime' : 'indigo'}
            onClick={() => {
              clipboard.copy(address)
              toast.success('Address copied to clipboard!', toastConfig)
            }}
          >
            <Wallet size={16} /> &nbsp; {addressShortener(address)}
          </Button>
        ) : (
          <Button color={'indigo'} onClick={() => connectWallet('injected')}>
            Connect Wallet
          </Button>
        )}
      </Group>
    </Header>
  )
}

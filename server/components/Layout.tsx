import { SiteHeader } from '../components/SiteHeader'
import { BACKGROUND_URL } from '../utils/constants'
import { AppShell } from '@mantine/core'
import { Web3State } from '../hooks/useWeb3State'

export const Layout = (props: { children: any; web3State: Web3State }) => {
  return (
    <AppShell
      padding="md"
      header={<SiteHeader web3State={props.web3State} />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          background: `url(${BACKGROUND_URL})`,
          // background: "url('maximalfocus-HakTxidk36I-unsplash.jpeg')",
          backgroundSize: 'cover',
          opacity: '70%',
        },
      })}
    >
      {props.children}
    </AppShell>
  )
}

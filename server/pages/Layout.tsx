import { SiteHeader } from './components/SiteHeader'
import { BACKGROUND_URL } from '../utils/constants'
import { AppShell } from '@mantine/core'

export const Layout = (props: { children: any }) => {
  return (
    <AppShell
      padding="md"
      header={<SiteHeader />}
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

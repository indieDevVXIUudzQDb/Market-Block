import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { AppShell, Header, Navbar } from '@mantine/core'
import { CustomNavbar } from './components/CustomNavbar'
import { CustomHeader } from './components/CustomHeader'

const Home: NextPage = () => {
  return (
    <AppShell
      padding="md"
      navbar={<CustomNavbar />}
      header={<CustomHeader />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          background: "url('shubham-dhage-T9rKvI3N0NM-unsplash.jpeg')",
          // background: "url('maximalfocus-HakTxidk36I-unsplash.jpeg')",
          backgroundSize: 'cover',
          opacity: '70%',
        },
      })}
    >
      <div style={{ minHeight: '1000px' }}></div>
      {/* Your application here */}
    </AppShell>
  )
}

export default Home

import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {AppShell, Header, Navbar} from "@mantine/core";
import {CustomNavbar} from "./components/CustomNavbar";
import {CustomHeader} from "./components/CustomHeader";

const Home: NextPage = () => {
  return (
      <AppShell
          padding="md"
          navbar={<CustomNavbar />}
          header={<CustomHeader />}
          styles={(theme) => ({
            main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
          })}
      >
        {/* Your application here */}
      </AppShell>
  )
}

export default Home

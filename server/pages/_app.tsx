import { AppProps } from 'next/app'
import Head from 'next/head'
import { MantineProvider } from '@mantine/core'
import { ThirdwebWeb3Provider } from '@3rdweb/hooks'

import '../styles/globals.css'

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  const supportedChainIds = [80001, 4]
  const connectors = {
    injected: {},
  }
  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThirdwebWeb3Provider
        supportedChainIds={supportedChainIds}
        connectors={connectors}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionOptions={{ key: 'mantine', prepend: false }}
          theme={{
            /** Put your mantine theme override here */
            colorScheme: 'dark',
            headings: { fontFamily: 'Russo One, sans-serif' },
          }}
        >
          <Component {...pageProps} />
        </MantineProvider>
      </ThirdwebWeb3Provider>
    </>
  )
}
import { AppProps } from 'next/app'
import Head from 'next/head'
import { MantineProvider } from '@mantine/core'

import '../styles/globals.css'
import { SITE_NAME } from '../utils/constants/constants'

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  return (
    <>
      <Head>
        <title>{SITE_NAME}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
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
    </>
  )
}

import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import Core from 'web3modal'
import { useLocalStorage } from '@mantine/hooks'

export interface Web3State {
  connected: undefined | boolean
  address: string | undefined
  provider: Web3Provider | undefined
  connectWallet: () => Promise<void>
  web3Modal: Core | undefined
}

export const useWeb3State = (): Web3State => {
  const [web3Modal, setWeb3Modal] = useState<Core>()
  const [provider, setProvider] = useState<Web3Provider>()
  const [address, setAddress] = useState<string>()
  const [connected, setConnected] = useState<boolean>()
  const [existingConnection, setExistingConnection] = useLocalStorage<boolean>({
    key: 'existingConnection',
    defaultValue: false,
  })

  const init = async () => {
    try {
      const web3M = new Web3Modal()
      setWeb3Modal(web3M)
      const conn = await web3M.connect()
      setAddress(conn.selectedAddress)
      setExistingConnection(true)
      const prov = new ethers.providers.Web3Provider(conn)
      setProvider(prov)

      console.log({ provider: prov })
      conn.on('accountsChanged', (accounts: string[]) => {
        console.log(accounts)
        if (accounts.length > 0) setAddress(accounts[0].toString())
      })

      // Subscribe to chainId change
      conn.on('chainChanged', (chainId: number) => {
        console.log(chainId)
      })

      // Subscribe to provider connection
      conn.on('connect', (info: { chainId: number }) => {
        setConnected(true)
        console.log(info)
      })

      // Subscribe to provider disconnection
      conn.on('disconnect', (error: { code: number; message: string }) => {
        console.log(error)
      })
    } catch (e) {
      console.log('Could not get a wallet connection', e)
      //Reset Connection
      setExistingConnection(false)
    }
  }
  useEffect(() => {
    if (existingConnection) {
      init()
    }
  }, [])

  const connectWallet = async () => {
    return init()
  }
  return {
    web3Modal,
    connectWallet,
    provider,
    connected,
    address,
  }
}

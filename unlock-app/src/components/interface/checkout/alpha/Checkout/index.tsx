import React from 'react'
import type { PaywallConfig } from '~/unlockTypes'
import { useCheckoutCommunication } from '~/hooks/useCheckoutCommunication'
import { useCheckout } from '../useCheckoutState'
import { Shell } from '../Shell'
import { Select } from './Select'
import { Quantity } from './Quantity'
import { Metadata } from './Metadata'
import { Confirm } from './Confirm'
import { MessageToSign } from './MessageToSign'
import { Minting } from './Minting'
import { CardPayment } from './CardPayment'

interface Props {
  injectedProvider: unknown
  paywallConfig: PaywallConfig
  communication: ReturnType<typeof useCheckoutCommunication>
}

export function Checkout({ paywallConfig, injectedProvider }: Props) {
  const { checkout, dispatch } = useCheckout({
    initialState: {
      current: 'SELECT',
      payment: 'crypto',
    },
    paywallConfig,
  })

  const onClose = () => {
    // TODO
  }

  function Content() {
    switch (checkout.state.current) {
      case 'SELECT': {
        return (
          <Select
            injectedProvider={injectedProvider}
            paywallConfig={paywallConfig}
            dispatch={dispatch}
            state={checkout.state}
          />
        )
      }
      case 'QUANTITY': {
        return (
          <Quantity
            injectedProvider={injectedProvider}
            paywallConfig={paywallConfig}
            dispatch={dispatch}
            state={checkout.state}
          />
        )
      }
      case 'CARD': {
        return (
          <CardPayment
            injectedProvider={injectedProvider}
            paywallConfig={paywallConfig}
            dispatch={dispatch}
            state={checkout.state}
          />
        )
      }
      case 'METADATA': {
        return (
          <Metadata
            injectedProvider={injectedProvider}
            paywallConfig={paywallConfig}
            dispatch={dispatch}
            state={checkout.state}
          />
        )
      }
      case 'CONFIRM': {
        return (
          <Confirm
            injectedProvider={injectedProvider}
            paywallConfig={paywallConfig}
            dispatch={dispatch}
            state={checkout.state}
          />
        )
      }
      case 'MESSAGE_TO_SIGN': {
        return (
          <MessageToSign
            injectedProvider={injectedProvider}
            paywallConfig={paywallConfig}
            dispatch={dispatch}
            state={checkout.state}
          />
        )
      }
      case 'MINTING': {
        return (
          <Minting
            onClose={onClose}
            injectedProvider={injectedProvider}
            paywallConfig={paywallConfig}
            dispatch={dispatch}
            state={checkout.state}
          />
        )
      }
      default: {
        return null
      }
    }
  }

  return (
    <Shell.Root onClose={onClose}>
      <Shell.Head
        description={checkout.content.description}
        title={paywallConfig.title!}
        iconURL={paywallConfig.icon!}
      />
      <Content />
    </Shell.Root>
  )
}

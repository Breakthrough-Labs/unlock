import { PaywallConfig } from '@unlock-protocol/types'
import { Enabler } from './provider'

/**
 * Dispatches events
 * @param eventName
 * @param params
 */
export const dispatchEvent = (eventName: string, params: any) => {
  let event: any

  // Keep because it will break legacy integrations
  if (eventName === unlockEvents.status) {
    dispatchEvent('unlockProtocol', params.state)
  }

  try {
    event = new window.CustomEvent(eventName, { detail: params })
  } catch (e) {
    // older browsers do events this clunky way.
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#The_old-fashioned_way
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/initCustomEvent#Parameters
    event = window.document.createEvent('customevent')
    event.initCustomEvent(
      eventName,
      true /* canBubble */,
      true /* cancelable */,
      params
    )
  }
  window.dispatchEvent(event)
}

/**
 * Mapping between events and their names
 */
export const unlockEvents = {
  status: 'unlockProtocol.status',
  authenticated: 'unlockProtocol.authenticated',
  transactionSent: 'unlockProtocol.transactionSent',
  closeModal: 'unlockProtocol.closeModal',
}

export const injectProviderInfo = (
  config: PaywallConfig,
  provider?: Enabler
) => {
  const newConfig = { ...config }

  if (newConfig.autoconnect) {
    newConfig.useDelegatedProvider = !!provider
  }

  // We want to inform the checkout iframe about the availability of a
  // delegated provider. However, we will not overwrite an existing
  // value in the config, in case the paywall owner has reason to
  // force it one way or the other.
  if (!newConfig.useDelegatedProvider) {
    newConfig.useDelegatedProvider = !!provider
  }

  return newConfig
}

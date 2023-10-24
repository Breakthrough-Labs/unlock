import React from 'react'
import { EventContentWithProps } from '~/components/content/EventContent'
import { toFormData } from '~/components/interface/locks/metadata/utils'
import { storage } from '~/config/storage'

interface Params {
  params: {
    slug: string
  }
}

interface EventPageProps {
  pageProps: {
    event?: any // TODO: type this
  }
}

export const getServerSideProps = async ({ params }: Params) => {
  const { data: eventMetadata } = await storage.getEvent(params.slug)
  return {
    props: {
      event: {
        ...toFormData(eventMetadata.data),
      },
      checkoutConfig: eventMetadata.checkoutConfig,
    },
  }
}

const EventPage = (props: EventPageProps) => {
  console.log(props.pageProps)
  return <EventContentWithProps {...props.pageProps}></EventContentWithProps>
}

export default EventPage

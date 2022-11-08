import Layout from '../components/layouts/main'
import Chakra from '../components/chakra'
import { BoardStateProvider } from '../components/board-state-provider'

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}

function Website({ Component, pageProps, router }) {
  return (
    <Chakra cookies={pageProps.cookies}>
      <Layout router={router}>
        <BoardStateProvider>
          <Component {...pageProps} key={router.route} />
        </BoardStateProvider>
      </Layout>
    </Chakra>
  )
}

export default Website

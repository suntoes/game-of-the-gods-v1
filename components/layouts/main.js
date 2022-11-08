import Head from 'next/head'
import { Box } from '@chakra-ui/react'

const Main = ({ children }) => {
  return (
    <Box as="main">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="An abstract 3d board game based on Maya Chess."
        />
        <meta name="author" content="Mar Santos" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="twitter:title" content="Game of the Gods" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="Game of the Gods" />
        <meta name="twitter:creator" content="Game of the Gods" />
        <meta
          name="twitter:image"
          content="https://suntoes.codes/images/works/game-of-the-gods.png"
        />
        <meta name="og:title" content="Game of the Gods" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://suntoes.codes/images/works/game-of-the-gods.png"
        />
        <meta
          property="og:description"
          content="An abstract 3d board game based on Maya Chess."
        />
        <title>Game of the Gods</title>
      </Head>

      {children}
    </Box>
  )
}

export default Main

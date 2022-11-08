import { Box, Container, Heading, Link, Text } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

import Board from '../components/board'
import { Gui, GameOptions } from '../components/gui'

const Home = () => (
  <>
    <Box
      display="flex"
      position="absolute"
      boxSize="full"
      transform={'translateX(-9999px)'}
    >
      <Container centerContent maxW="container.xl" justifyContent="space-between">
        <Box w="full" mb={2}>
          <Text
            fontSize={{ base: '0.55em', sm: '0.8em', md: '1em' }}
            transform={'translateX(9999px)'}
          >
            learn more about the official Maya Chess{' '}
            <Link target="_blank" href="https://www.mayachess.com/">
              here <ExternalLinkIcon />
            </Link>
          </Text>
          <Gui transform={'translateX(9999px)'} />
        </Box>
        <Box w="full" textAlign="right" transform={'translateX(9999px)'} pt={2}>
          <GameOptions />
          <Heading fontSize={{ base: '1em', sm: '1.3em', md: '1.8em' }}>
            game of the gods
          </Heading>
          <Text fontSize={{ base: '0.55em', sm: '0.8em', md: '1em' }}>
            based on Maya Chess, developed by{' '}
            <Link
              target="_blank"
              href="https://suntoes.codes/works/gameofthegods"
            >
              suntoes <ExternalLinkIcon />
            </Link>{' '}
          </Text>
        </Box>
      </Container>
    </Box>
    <Board />
  </>
)

export default Home

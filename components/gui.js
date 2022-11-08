import {
  Box,
  Button,
  Heading,
  Link,
  Spinner,
  Text,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { useBoardContext } from './board-state-provider'
import * as utils from '../lib/game-maths'

export const Gui = props => {
  const { isLoading, boardState } = useBoardContext()
  const { remainingMoves, currentTurn } = utils.TurnCountToSystem(
    boardState.turnCount
  )

  return (
    <Box>
      {isLoading ? (
        <Spinner size="xl" mb={10} {...props} />
      ) : (
        <>
          <Heading fontSize={30} {...props}>
            {boardState.winner
              ? boardState.winner === 'l'
                ? 'light won the game'
                : 'dark won the game'
              : (currentTurn === 'l' ? 'light' : 'dark') +
                ' to move ' +
                remainingMoves +
                'x'}
          </Heading>
        </>
      )}
    </Box>
  )
}

export const GameOptions = () => {
  const { toggleColorMode } = useColorMode()
  const [modalState, setModalState] = useState(false)
  const { boardState, resetFunc, loadPrevFunc } = useBoardContext()

  const onClose = () => setModalState(false)

  const clearLocalSesh = () =>
    localStorage.removeItem('game-of-the-gods-session')

  const handleReset = () =>
    boardState?.winner || !(boardState?.turnCount !== 0)
      ? resetFunc()
      : setModalState({
          title: 'current match will be lost',
          body: 'are you sure you want to reset?',
          secondary: onClose,
          primary: () => {
            resetFunc()
            clearLocalSesh()
            onClose()
          }
        })

  useEffect(() => {
    if (loadPrevFunc) {
      const { date } = JSON.parse(
        localStorage.getItem('game-of-the-gods-session')
      )
      setModalState({
        title: 'previous ongoing match found',
        body:
          'at ' +
          new Date(date).toDateString().toLowerCase() +
          ', would you like to load it?',
        secondary: () => {
          clearLocalSesh()
          onClose()
        },
        primary: () => {
          loadPrevFunc()
          onClose()
        }
      })
    }
  }, [loadPrevFunc])

  return (
    <>
      <Text fontSize={{ base: '0.55em', sm: '0.8em', md: '1em' }}>
        <Text as={Link} onClick={handleReset}>
          reset match
        </Text>{' '}
        |{' '}
        <Text as={Link} onClick={toggleColorMode}>
          {useColorModeValue('dark', 'light')} mode
        </Text>
      </Text>
      <Modal isOpen={modalState} onClose={onClose} closeOnOverlayClick={false} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalState?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{modalState?.body}</Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={modalState?.secondary}>
              nah
            </Button>
            <Button colorScheme="red" mr={3} onClick={modalState?.primary}>
              yup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>{' '}
    </>
  )
}

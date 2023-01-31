import React, { useContext, useState, useEffect } from 'react'

const BoardStateContext = React.createContext()

const BoardStateProvider = props => {
  const [isLoading, setIsLoading] = useState(true)
  const [boardState, setBoardState] = useState({})
  const [resetFunc, setResetFunc] = useState(() => {})
  const [loadPrevFunc, setLoadPrevFunc] = useState(false)

  useEffect(() => {
    if (!boardState?.winner && boardState?.turnCount)
      localStorage.setItem(
        'game-of-the-gods-session',
        JSON.stringify({
          boardState,
          date: Date.now()
        })
      )
  }, [boardState])

  const value = {
    isLoading,
    setIsLoading,
    boardState,
    setBoardState,
    resetFunc,
    setResetFunc,
    loadPrevFunc,
    setLoadPrevFunc
  }

  return (
    <BoardStateContext.Provider value={value}>
      {props.children}
    </BoardStateContext.Provider>
  )
}

const useBoardContext = () => {
  const context = useContext(BoardStateContext)
  if (!context)
    throw new Error(
      'useBoardContext cannot be used outside of a BoardStateProvider'
    )
  return context
}

export { BoardStateProvider, useBoardContext, BoardStateContext }

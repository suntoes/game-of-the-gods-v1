import PieceHelper from './piece_structure'

export const DegToRad = degrees => {
  return degrees * (Math.PI / 180)
}

export const TurnCountToSystem = n => {
  const maxDivByThree = Math.floor(n / 3) * 3
  const currentTurn = maxDivByThree % 2 ? 'd' : 'l'
  const remainingMoves = 3 - (n - maxDivByThree)
  return { currentTurn, remainingMoves }
}

export const ValidateMoveSet = (selectedPiece, moveSet, BoardState) => {
  if (selectedPiece.toLowerCase() === 'l') return moveSet
  const { remainingMoves } = TurnCountToSystem(BoardState.turnCount)
  const templeIndexes = [7, 52, 75, 120]
  const { pieces } = BoardState
  let filteredMoveSet = moveSet
  let pieceOnTemple = null

  for (let piece in pieces) {
    if (piece.toLowerCase() === 'l') continue
    if (pieceOnTemple) break
    if (pieces[piece].indexes.some(n => templeIndexes.includes(n)))
      pieceOnTemple = piece
  }

  // Disable move that'll hover unto the temple if there's only 1 move left
  if (remainingMoves === 1)
    filteredMoveSet = moveSet.filter(
      move => !move.indexes.some(n => templeIndexes.includes(n))
    )
  // Removes "Other" pieces moveset if there's a piece resting on temple
  if (pieceOnTemple && selectedPiece !== pieceOnTemple) filteredMoveSet = []

  return filteredMoveSet
}

export const DetectWinByTemple = BoardState => {
  const lightTemple = [7, 52]
  const darkTemple = [75, 120]
  const { pieces } = BoardState

  let winner = null

  // Check if each leader is on either sides' temples
  if (darkTemple.includes(pieces.l.base)) winner = 'l'
  if (lightTemple.includes(pieces.L.base)) winner = 'd'

  return winner
}

export const DetectWinByCrush = BoardState => {
  const { pieces } = BoardState
  const { l, L } = pieces

  let winner = null

  for (let piece in pieces) {
    if (piece.toLowerCase() === 'l') continue

    const checkCollision = (pieceIndexes, leaderIndexes) =>
      pieceIndexes.some(n => leaderIndexes.includes(n))

    // Checks if a piece beside leader has the same index as a leader' (crushed)
    if (checkCollision(pieces[piece].indexes, L.indexes)) winner = 'l'
    else if (checkCollision(pieces[piece].indexes, l.indexes)) winner = 'd'
  }

  return winner
}

export const DetectWinByTrap = BoardState => {
  const lightSet = ['l', 'd', 'c', 'g', 'a']
  const darkSet = ['L', 'D', 'C', 'G', 'A']

  let winner = null

  // Gets every move in advance and checks if there is none left
  if (
    lightSet.every(
      piece => PieceHelper.getMoveSet(piece, BoardState).length === 0
    )
  )
    winner = 'd'
  if (
    darkSet.every(
      piece => PieceHelper.getMoveSet(piece, BoardState).length === 0
    )
  )
    winner = 'l'

  return winner
}

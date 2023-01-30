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

export const ValidateMoveSet = (selectedPiece, moveSet, BoardState) => {
  const { isLight, isLeader, getMoveSet } = PieceHelper
  const { remainingMoves } = TurnCountToSystem(BoardState.turnCount)
  const selectedIsLight = isLight(selectedPiece)
  const baseTemples = isLight(selectedPiece) ?  [7, 52] : [75, 120]
  const temples = [7, 52, 75, 120]
  const { pieces } = BoardState
  let filteredMoveSet = moveSet
  let pieceOnTemple = null
  // Ability to return id string of piece to focus on reevaluation of moveset
  let passToThisPiece = false;

  // Detects if there's piece on temple and what piece is it
  for (let piece in pieces) {
    if (pieceOnTemple) break
    if (pieces[piece].indexes.some(n => ( isLeader(piece) ? baseTemples : temples).includes(n)))
    // Ensure focus on moveset validation is stayed on current turn
    pieceOnTemple = selectedIsLight === isLight(piece) ? piece : false;
  }

  // Disable move that'll land unto the temple if there's only 1 move left
  if (!pieceOnTemple && remainingMoves === 1)
    filteredMoveSet = moveSet.filter(
      move => !move.indexes.some(n => ( isLeader(selectedPiece) ? baseTemples : temples ).includes(n))
    )

  // Condition if selected piece is not the one resting on temple
  else if (pieceOnTemple && selectedPiece !== pieceOnTemple) {
    
    // Block all move if remaining move is the last
    if (remainingMoves === 1) passToThisPiece = pieceOnTemple
    
    // Removes move that will block pieceOnTemple inside before last move
    else if (remainingMoves === 2) {
      const makeBoardState = (boardState, targetPiece, move) => {
        const newPieces = {
          ...JSON.parse(JSON.stringify(boardState.pieces)), 
          ...{[targetPiece]: move}
        }
        return {...boardState, pieces: newPieces}
      }
      filteredMoveSet = moveSet.filter(
        move => {
          const fakeBoardState = makeBoardState(BoardState, selectedPiece, move)
          const pieceOnTempleMoves = getMoveSet(pieceOnTemple, fakeBoardState)
          if(pieceOnTempleMoves.length) return true
          else return false
        }
      )
    }

  }

  return passToThisPiece ? passToThisPiece : filteredMoveSet
}

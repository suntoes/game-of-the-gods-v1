export default class PieceHelper {
  static getMoveSet(piece, BoardState) {
    let moves = []
    switch (piece) {
      case 'l':
      case 'L':
        moves = PieceHelper.getLeaderMoves(piece, BoardState)
        break
      case 'd':
      case 'D':
        moves = PieceHelper.getDefenderMoves(piece, BoardState)
        break
      case 'c':
      case 'C':
        moves = PieceHelper.getCaptainMoves(piece, BoardState)
        break
      case 'g':
      case 'G':
        moves = PieceHelper.getGuardianMoves(piece, BoardState)
        break
      case 'a':
      case 'A':
        moves = PieceHelper.getAttackerMoves(piece, BoardState)
        break
      default:
        moves = []
        break
    }

    moves = PieceHelper.filterForbiddenZone(piece, moves)
    moves = PieceHelper.filterReservedIndexes(piece, moves, BoardState.pieces)
    return moves
  }

  static isDark(piece) {
    return piece === piece?.toUpperCase()
  }

  static isLight(piece) {
    return piece === piece?.toLowerCase()
  }

  // static isOpponent(isWhite, pieceID) {
  //   if (isWhite) return PieceHelper.isBlack(pieceID)
  //   return PieceHelper.isWhite(pieceID)
  // }

  static filterForbiddenZone = (piece, moves) => {
    if (piece.toLowerCase() === 'l') return moves

    const lightFZone = [5, 6, 7, 14, 15, 22, 23, 31, 39]
    const darkFZone = [88, 96, 104, 105, 112, 113, 120, 121, 122]

    return moves.filter(({ indexes }) =>
      indexes.every(
        n => !(PieceHelper.isDark(piece) ? darkFZone : lightFZone).includes(n)
      )
    )
  }

  static filterReservedIndexes = (mainPiece, moves, pieces) => {
    const enemyLeader = PieceHelper.isDark(mainPiece) ? 'l' : 'L'
    //    const isSpecial = p => ["g", "a", "d"].includes(p.toLowerCase())
    const isLeader = mainPiece.toLowerCase() === 'l'
    const pieceArr = []

    for (let piece in pieces) {
      if (piece !== enemyLeader && !isLeader && piece !== mainPiece)
        pieceArr.push({ ...pieces[piece], name: piece })
    }

    return moves.filter(({ base, variation, indexes, restrict }) => {
      const indexList = pieceArr.map(({ indexes: _indexes }) => _indexes).flat()
      let restrictQuery = [...indexes]
      let restrictList = []

      pieceArr.forEach(piece => {
        let restrictToAdd = piece.restrict || []
        // Some independent rules for piece restrictions
        switch (mainPiece.toLowerCase()) {
          case 'a':
            if (variation === 0) {
              restrictQuery = indexes.filter(n => n !== base)
              if (piece.name.toLowerCase() === 'd' && piece.variation === 1) {
                restrictToAdd = piece.restrict
              }
            }
            if (variation === 1) {
              if (piece.name.toLowerCase() === 'd' && piece.variation === 1) {
                restrictQuery.push(restrict[1])
                restrictToAdd = piece.indexes
              }
            }
            break
          case 'd':
            if (variation === 0) {
              restrictQuery = restrict
              if (piece.name.toLowerCase() === 'a' && piece.variation === 2) {
                restrictToAdd = [piece.base]
              }
              if (piece.name.toLowerCase() === 'd' && piece.variation === 1) {
                restrictToAdd = piece.indexes
              }
            }
          default:
        }
        restrictList = [...restrictList, ...restrictToAdd]
      })

      let indexCollisionTest = indexes.every(n => !indexList.includes(n))
      let restrictCollisionTest = restrictQuery.every(
        n => !restrictList.includes(n)
      )

      return indexCollisionTest && restrictCollisionTest
    })
  }

  static getSurroundingTile(piece, BoardState) {
    const currBase = BoardState.pieces[piece].base
    const isLightBase = (Math.floor(currBase / 8) * 7) % 2 ? true : false
    const rotateY = isLightBase ? 60 : -60
    const getVal = l => currBase + (isLightBase ? l : l * -1)
    let moves = [
      { base: getVal(8), indexes: [getVal(8)], variation: 0, rotateY },
      { base: getVal(-8), indexes: [getVal(-8)], variation: 0, rotateY },
      { base: getVal(-9), indexes: [getVal(-9)], variation: 0, rotateY }
    ]
    const filterOutOfBounds = arr =>
      arr
        .filter(
          (
            move // check decrement bounds
          ) =>
            [0, 1, 2, 3, 4, 5, 6].includes(currBase)
              ? move.base > currBase
              : true
        )
        .filter(
          (
            move // check increment bounds
          ) =>
            [121, 122, 123, 124, 125, 126, 127].includes(currBase)
              ? move.base < currBase
              : true
        )
        .filter(
          (
            move // check even only moveset
          ) =>
            [8, 24, 40, 56, 72, 88, 104, 120].includes(currBase)
              ? move.base % 2 === 0
              : true
        )
        .filter(
          (
            move // check odd only moveset
          ) =>
            [7, 23, 39, 55, 71, 87, 103, 119].includes(currBase)
              ? move.base % 2
              : true
        )

    moves = filterOutOfBounds(moves)
    return moves
  }

  static getDefenderMoves = require('./defender')

  static getLeaderMoves(piece, BoardState) {
    return PieceHelper.getSurroundingTile(piece, BoardState)
  }

  static getCaptainMoves(piece, BoardState) {
    return PieceHelper.getSurroundingTile(piece, BoardState)
  }

  static getAttackerMoves = require('./attacker')

  static getGuardianMoves(piece, BoardState) {
    return PieceHelper.getSurroundingTile(piece, BoardState).map(move => ({
      ...move,
      restrict: [move.base]
    }))
  }
}

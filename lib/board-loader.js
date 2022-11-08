export const FENLoader = () => {
  const lastSesh = false
  if (lastSesh) {
    return JSON.parse(lastSesh)
  } else
    return {
      winner: null,
      turnCount: 0,
      pieces: {
        l: { variation: 0, base: 7, indexes: [7], rotateY: 0 },
        a: {
          variation: 0,
          base: 21,
          indexes: [13, 21],
          restrict: [4, 5, 21],
          rotateY: 90
        },
        g: {
          variation: 0,
          base: 30,
          indexes: [30],
          restrict: [30],
          rotateY: 30
        },
        c: { variation: 0, base: 38, indexes: [38], rotateY: 90 },
        d: {
          variation: 0,
          base: 47,
          indexes: [47],
          restrict: [38, 39, 47, 54, 55],
          rotateY: 30
        },
        L: { variation: 0, base: 120, indexes: [120], rotateY: 0 },
        A: {
          variation: 0,
          base: 106,
          indexes: [106, 114],
          restrict: [106, 122, 123],
          rotateY: -90
        },
        G: {
          variation: 0,
          base: 97,
          indexes: [97],
          restrict: [97],
          rotateY: 90
        },
        C: { variation: 0, base: 89, indexes: [89], rotateY: 30 },
        D: {
          variation: 0,
          base: 80,
          indexes: [80],
          restrict: [72, 73, 80, 88, 89],
          rotateY: -150
        }
      }
    }
}

export const convertToFEN = BoardState => JSON.stringify(BoardState)

export const ResetQueryTable = BoardState => {
  return BoardState
}

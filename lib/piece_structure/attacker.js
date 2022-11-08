// Assuming that the board is like this:
//
//     dark /\
//         /  \
//        /    \
//        \    /
//         \  /
//          \/ light
//
// The attacker piece is shaped with text
// with different rotation/variation below
//
// The numbers pointed around the shapes are
// the directions of the predicted move, it
// is relative with the chronical order of
// the tryMove(() => makeMove() functions)
//
// arch linux push test

module.exports = (piece, BoardState) => {
  const cOne = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15]
  const cTwo = [23, 39, 55, 71, 87, 103, 119, 15, 31, 47, 63, 79, 95, 111, 127]
  const cThree = [
    8, 24, 40, 56, 72, 88, 104, 120, 0, 16, 32, 48, 64, 80, 96, 112
  ]
  const cFour = [
    120, 121, 122, 123, 124, 125, 126, 127, 112, 113, 114, 115, 116, 117, 118,
    119
  ]

  const {
    base: currBase,
    variation: variant,
    rotateY: currRotateY
  } = BoardState.pieces[piece]
  const isLightBase = val => ((Math.floor(val / 8) * 7) % 2 ? true : false)

  let moves = []

  const getVal = l => currBase + (isLightBase(currBase) ? l : l * -1)

  const tryRestricts = (nextBase, arr) =>
    (arr || [])
      .filter(vals => {
        if (!isNaN(vals)) return true
        // eslint-disable-next-line no-unused-vars
        const [val, cornersToTest = []] = vals
        return !(cornersToTest || []).flat().includes(getVal(nextBase))
      })
      .map(vals => {
        const n = isNaN(vals) ? vals[0] : vals
        return n * (isLightBase(getVal(nextBase)) ? 1 : -1) + getVal(nextBase)
      })

  const makeMove = (base, indexes, restrict, variation, rotateY) =>
    moves.push({
      base: getVal(base),
      indexes: indexes.map(n => getVal(n)),
      restrict: [getVal(base), ...tryRestricts(base, restrict)],
      variation,
      rotateY
    })

  const tryMove = (callback, cornersToTest) =>
    !(cornersToTest || []).flat().includes(currBase) && callback()

  //  console.log(`v${variant} at ${currBase}, ${isLightBase(currBase) ? 'light' : 'dark'} base and rotateY of ${currRotateY}`)
  if (variant === 0) {
    if (currRotateY === 90) {
      //  1_
      // 3|_/2
      //  4
      tryMove(() => makeMove(-8, [-8, 1], [-1, [-17, cOne]], 0, -60), cThree)
      tryMove(
        () =>
          makeMove(
            -9,
            [-9, -1],
            [
              [1, cTwo],
              [-16, cOne]
            ],
            0,
            60
          ),
        cTwo
      )
      tryMove(
        () =>
          makeMove(
            17,
            [17],
            [[-25, [cTwo, cFour]], -8, [-9, cTwo], [8, cOne]],
            1,
            -120
          ),
        cThree
      )
      tryMove(() =>
        makeMove(
          16,
          [16],
          [[-25, [cTwo, cFour]], -8, [-9, cTwo], [8, cOne]],
          1,
          -120
        )
      )
    } else if (currRotateY === 30) {
      //  4_
      // 3|_\2
      //   1
      tryMove(() => makeMove(-8, [-8, -16], [16, [17, cThree]], 0, 60), cOne)
      tryMove(
        () =>
          makeMove(
            8,
            [8, 16],
            [
              [1, cThree],
              [-16, cFour]
            ],
            0,
            -60
          ),
        cFour
      )
      tryMove(
        () =>
          makeMove(
            -17,
            [-17],
            [[9, [cTwo, cFour]], [-9, cThree], -8, [8, cFour]],
            1,
            -120
          ),
        cOne
      )
      tryMove(() =>
        makeMove(
          -1,
          [-1],
          [[9, [cTwo, cFour]], [-9, cThree], -8, [8, cFour]],
          1,
          -120
        )
      )
    } else if (currRotateY === -30) {
      //  3_4
      //  | |
      // 1\/ 2
      tryMove(
        () => makeMove(8, [8, 17], [-1, [-17, cOne]], 0, 60),
        [cOne, cThree]
      )
      tryMove(
        () => makeMove(-9, [-9, -17], [8, 16, [17, cTwo]], 0, -60),
        [cTwo, cFour]
      )
      tryMove(
        () =>
          makeMove(
            1,
            [1],
            [[7, [cOne, cTwo]], [-9, cTwo], -8, [8, cOne]],
            1,
            -120
          ),
        cThree
      )
      tryMove(
        () =>
          makeMove(
            -16,
            [-16],
            [[7, [cOne, cTwo]], [-9, cTwo], -8, [8, cOne]],
            1,
            -120
          ),
        cFour
      )
    } else if (currRotateY === -90) {
      //   _3
      // 2/_|4
      //  1
      tryMove(() => makeMove(-8, [-8, 1], [-1, [-17, cFour]], 0, -60), cTwo)
      tryMove(
        () =>
          makeMove(
            -9,
            [-9, -1],
            [
              [1, cThree],
              [-16, cFour]
            ],
            0,
            +60
          ),
        cThree
      )
      tryMove(() =>
        makeMove(
          16,
          [16],
          [[-25, [cOne, cThree]], [-9, cThree], -8, [8, cFour]],
          1,
          240
        )
      )
      tryMove(
        () =>
          makeMove(
            17,
            [17],
            [[-25, [cOne, cThree]], [-9, cThree], -8, [8, cFour]],
            1,
            240
          ),
        cTwo
      )
    } else if (currRotateY === -150) {
      //  1_
      // 2\_|4
      //    3
      tryMove(() => makeMove(-8, [-8, -16], [16, [17, cTwo]], 0, 60), cFour)
      tryMove(
        () =>
          makeMove(
            8,
            [8, 16],
            [
              [1, cTwo],
              [-16, cOne]
            ],
            0,
            300
          ),
        cOne
      )
      tryMove(
        () =>
          makeMove(
            -1,
            [-1],
            [[9, [cOne, cThree]], [-9, cTwo], -8, [8, cOne]],
            1,
            240
          ),
        cFour
      )
      tryMove(() =>
        makeMove(
          -17,
          [-17],
          [[9, [cOne, cThree]], [-9, cTwo], -8, [8, cOne]],
          1,
          240
        )
      )
    } else if (currRotateY === 150) {
      // 2/\1
      //  |_|
      //  4 3
      tryMove(
        () => makeMove(8, [8, 17], [-1, [-17, cFour]], 0, -300),
        [cTwo, cFour]
      )
      tryMove(
        () => makeMove(-9, [-9, -17], [16, [17, cThree]], 0, -60),
        [cOne, cThree]
      )
      tryMove(
        () =>
          makeMove(
            1,
            [1],
            [[7, [cThree, cFour]], [-9, cThree], -8, [8, cFour]],
            1,
            -120
          ),
        cTwo
      )
      tryMove(
        () =>
          makeMove(
            -16,
            [-16],
            [[7, [cThree, cFour]], [-9, cThree], -8, [8, cFour]],
            1,
            -120
          ),
        cOne
      )
    }
  } else if (variant === 1) {
    if (currRotateY === -30) {
      //   _1
      //  |_/ 2
      // 3
      tryMove(() => makeMove(-16, [-16, -8], [16, [17, cThree]], 0, 120), cFour)
      tryMove(
        () => makeMove(-17, [-17, -9], [16, [17, cThree]], 0, 120),
        [cFour, cTwo]
      )
      tryMove(
        () => makeMove(8, [8], [[-9, cThree], -8, [8, cFour]], 2, 60),
        cOne
      )
    } else if (currRotateY === -90) {
      // 3 _
      //  |_\ 2
      //    1
      tryMove(() => makeMove(1, [1, -8], [-1, [-17, cOne]], 0, 120), cTwo)
      tryMove(
        () => makeMove(17, [17, 8], [-1, [-17, cOne]], 0, 120),
        [cTwo, cFour]
      )
      tryMove(
        () => makeMove(-9, [-9], [[-9, cTwo], -8, [8, cOne]], 2, 60),
        cThree
      )
    } else if (currRotateY === -150) {
      //   3
      //  | |
      // 2\/1
      tryMove(
        () =>
          makeMove(
            -1,
            [-1, -9],
            [
              [1, cThree],
              [-16, cFour]
            ],
            0,
            120
          ),
        cTwo
      )
      tryMove(
        () =>
          makeMove(
            16,
            [16, 8],
            [
              [1, cThree],
              [-16, cFour]
            ],
            0,
            120
          ),
        cOne
      )
      tryMove(() => makeMove(-8, [-8], [[-9, cThree], -8, [8, cFour]], 2, 60))
    } else if (currRotateY === 150) {
      //   _ 3
      // 1/_|
      //   2
      tryMove(
        () => makeMove(-17, [-17, -9], [8, 16, [17, cTwo]], 0, -240),
        [cOne, cThree]
      )
      tryMove(
        () => makeMove(-16, [-16, -8], [8, 16, [17, cTwo]], 0, -240),
        cOne
      )
      tryMove(
        () => makeMove(8, [8], [[-9, cTwo], -8, [8, cOne]], 2, -60),
        cFour
      )
    } else if (currRotateY === 90) {
      //  1_
      // 2\_|
      //     3
      tryMove(() => makeMove(1, [1, -8], [-1, [-17, cFour]], 0, -240), cThree)
      tryMove(
        () => makeMove(17, [17, 8], [-1, [-17, cFour]], 0, -240),
        [cThree, cOne]
      )
      tryMove(
        () => makeMove(-9, [-9], [[-9, cThree], -8, [8, cFour]], 2, -60),
        cTwo
      )
    } else if (currRotateY === 30) {
      // 1/\2
      //  |_|
      //   3
      tryMove(
        () =>
          makeMove(
            -1,
            [-1, -9],
            [
              [1, cTwo],
              [-16, cOne]
            ],
            0,
            120
          ),
        cThree
      )
      tryMove(
        () =>
          makeMove(
            16,
            [16, 8],
            [
              [1, cTwo],
              [-16, cOne]
            ],
            0,
            120
          ),
        cFour
      )
      tryMove(() => makeMove(-8, [-8], [[-9, cTwo], -8, [8, cOne]], 2, 60))
    }
  } else if (variant === 2) {
    if (currRotateY === 30) {
      tryMove(() =>
        makeMove(
          8,
          [8],
          [[-25, [cTwo, cFour]], -8, [-9, cTwo], [8, cOne]],
          1,
          -60
        )
      )
      tryMove(() =>
        makeMove(
          -8,
          [-8],
          [[7, [cOne, cTwo]], [-9, cTwo], -8, [8, cOne]],
          1,
          -180
        )
      )
      tryMove(() =>
        makeMove(
          -9,
          [-9],
          [[9, [cOne, cThree]], [-9, cTwo], -8, [8, cOne]],
          1,
          60
        )
      )
    } else if (currRotateY === 90) {
      tryMove(() =>
        makeMove(
          8,
          [8],
          [[-25, [cOne, cThree]], [-9, cThree], -8, [8, cFour]],
          1,
          60
        )
      )
      tryMove(() =>
        makeMove(
          -8,
          [-8],
          [[7, [cThree, cFour]], [-9, cThree], -8, [8, cFour]],
          1,
          -60
        )
      )
      tryMove(() =>
        makeMove(
          -9,
          [-9],
          [[9, [cTwo, cFour]], [-9, cThree], -8, [8, cFour]],
          1,
          -180
        )
      )
    } else if (currRotateY === -90) {
      tryMove(() =>
        makeMove(
          8,
          [8],
          [[-25, [cTwo, cFour]], -8, [-9, cTwo], [8, cOne]],
          1,
          60
        )
      )
      tryMove(() =>
        makeMove(
          -8,
          [-8],
          [[7, [cOne, cTwo]], [-9, cTwo], -8, [8, cOne]],
          1,
          -60
        )
      )
      tryMove(() =>
        makeMove(
          -9,
          [-9],
          [[9, [cOne, cThree]], [-9, cTwo], -8, [8, cOne]],
          1,
          180
        )
      )
    } else if (currRotateY === -30) {
      tryMove(() =>
        makeMove(
          8,
          [8],
          [[-25, [cOne, cThree]], [-9, cThree], -8, [8, cFour]],
          1,
          180
        )
      )
      tryMove(() =>
        makeMove(
          -8,
          [-8],
          [[7, [cThree, cFour]], [-9, cThree], -8, [8, cFour]],
          1,
          60
        )
      )
      tryMove(() =>
        makeMove(
          -9,
          [-9],
          [[9, [cTwo, cFour]], [-9, cThree], -8, [8, cFour]],
          1,
          -60
        )
      )
    }
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
  }

  //  console.log(`at ${currBase} and ${currRotateY}degree with ${BoardState.pieces[piece]?.restrict} and bases of ${JSON.stringify(moves.map(move => move.base))}`)
  return moves
}

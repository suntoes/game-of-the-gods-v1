// Assuming that the board is like this:
//
//     dark /\
//         /  \
//        /    \
//        \    /
//         \  /
//          \/ light
//
// The defender piece is shaped with text
// with different rotation/variation below
//
// The numbers pointed around the shapes are
// the directions of the predicted move, it
// is relative with the chronical order of
// the tryMove(() => makeMove() functions)

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

  const _cOne = [16, 17, 18, 19, 20, 21, 22, 23]
  const _cTwo = [6, 22, 38, 54, 70, 86, 102, 118]
  const _cThree = [9, 25, 41, 57, 73, 89, 105, 121]
  const _cFour = [104, 105, 106, 107, 108, 109, 110, 111]

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

  // console.log(`v${variant} at ${currBase}, ${isLightBase ? 'light' : 'dark'} base and rotateY of ${currRotateY}`)
  if (variant === 0) {
    if (currRotateY === 30) {
      //     _
      //  2 | | 3
      //    |_|
      //     1
      tryMove(() =>
        makeMove(
          -8,
          [-8],
          [[-9, cTwo], -8, [7, [cOne, cTwo]], [8, cOne]],
          0,
          -180
        )
      ) // 1
      tryMove(
        () =>
          makeMove(
            -10,
            [-9, -1, -10],
            [[-10, _cTwo], -9, -8, -1, [7, cOne], [8, cOne]],
            1,
            -180
          ),
        [cThree, _cThree]
      ) // 2
      tryMove(
        () =>
          makeMove(
            8,
            [8, 16, 24],
            [[-25, cTwo], -24, -16, [-9, cTwo], -8, [8, cOne]],
            1,
            -60
          ),
        [cFour, _cFour]
      ) // 3
    } else if (currRotateY === -150) {
      //
      //    1_
      //    | |
      //  2 |_| 3
      tryMove(() =>
        makeMove(-8, [-8], [[-9, cThree], -8, 7, [8, cFour]], 0, 180)
      )
      tryMove(
        () =>
          makeMove(
            8,
            [8, 16, 24],
            [[-25, cThree], -24, -16, [-9, cThree], -8, [8, cFour]],
            1,
            300
          ),
        [cOne, _cOne]
      )
      tryMove(
        () =>
          makeMove(
            -10,
            [-9, -1, -10],
            [[-10, _cThree], -9, -8, -1, [7, cFour], [8, cFour]],
            1,
            180
          ),
        [cTwo, _cTwo]
      )
    } else if (currRotateY === -30) {
      //      __
      //    3/ /
      //    /_/ 2
      //   1
      tryMove(
        () =>
          makeMove(
            8,
            [8],
            [[-25, [cThree, cOne]], [-9, cThree], -8, [8, cFour]],
            0,
            180
          ),
        cOne
      )
      tryMove(
        () =>
          makeMove(
            -9,
            [-9, -17, -26],
            [[-9, cThree], -8, 8, 9, 17, [25, _cFour]],
            1,
            -60
          ),
        [cFour, _cFour, cTwo, _cTwo]
      )
      tryMove(
        () =>
          makeMove(
            -24,
            [-8, -16, -24],
            [[-25, cThree], -24, -16, [-9, cThree], -8, [8, cFour]],
            1,
            180
          ),
        [cFour, _cFour]
      )
    } else if (currRotateY === 90) {
      //   __
      //   \ \ 2
      //   3\_\
      //       1
      tryMove(
        () =>
          makeMove(
            -9,
            [-9],
            [[-9, cThree], -8, [8, cFour], [9, [cFour, cTwo]]],
            0,
            -180
          ),
        cTwo
      )
      tryMove(
        () =>
          makeMove(
            -8,
            [-8, 1, -7],
            [[-10, _cThree], -9, -8, -1, [7, cFour], [8, cFour]],
            1,
            -60
          ),
        [cThree, _cThree]
      )
      tryMove(
        () =>
          makeMove(
            25,
            [8, 17, 25],
            [[-9, cThree], -8, 8, 9, 17, [25, _cFour]],
            1,
            -180
          ),
        [cThree, _cThree, cOne, _cOne]
      )
    } else if (currRotateY === 150) {
      //
      //     __1
      //  2 / /
      //   /_/3
      tryMove(
        () =>
          makeMove(
            8,
            [8],
            [[-25, [cFour, cTwo]], [-9, cTwo], -8, [8, cOne]],
            0,
            -180
          ),
        cFour
      )
      tryMove(
        () =>
          makeMove(
            -9,
            [-9, -17, -26],
            [[-9, cTwo], -8, 8, 9, 17, [25, _cOne]],
            1,
            -60
          ),
        [cOne, _cOne, cThree, _cThree]
      )
      tryMove(
        () =>
          makeMove(
            -24,
            [-8, -16, -24],
            [[-25, cTwo], -24, -16, [-9, cTwo], -8, [8, cOne]],
            1,
            -180
          ),
        [cOne, _cOne]
      )
    } else if (currRotateY === -90) {
      //
      //    1__
      //     \ \ 3
      //     2\_\
      tryMove(
        () =>
          makeMove(
            -9,
            [-9],
            [[-9, cTwo], -8, [8, cOne], [9, [cOne, cThree]]],
            0,
            180
          ),
        cThree
      )
      tryMove(
        () =>
          makeMove(
            -8,
            [-8, 1, -7],
            [[-10, _cTwo], -9, -8, -1, [7, cOne], [8, cOne]],
            1,
            -60
          ),
        [cTwo, _cTwo]
      )
      tryMove(
        () =>
          makeMove(
            25,
            [8, 17, 25],
            [[-9, cTwo], -8, 8, 9, 17, [25, _cOne]],
            1,
            180
          ),
        [cTwo, _cTwo, cFour, _cFour]
      )
    }
  } else if (variant === 1) {
    if (currRotateY === -30) {
      //      _4
      //   2 / /
      //    / / 1
      //   3\/
      tryMove(
        () =>
          makeMove(
            -25,
            [-9, -17, -25],
            [[-25, cThree], -24, -16, [-9, cThree], -8, [8, cFour]],
            1,
            180
          ),
        cTwo
      ) // 1
      tryMove(
        () =>
          makeMove(
            -7,
            [9, 1, -7],
            [[-25, cThree], -24, -16, [-9, cThree], -8, [8, cFour]],
            1,
            180
          ),
        [cThree, cOne]
      ) // 2
      tryMove(
        () => makeMove(8, [8], [[-9, cThree], -8, 7, [8, cFour]], 0, 60),
        cOne
      ) // 3
      tryMove(() =>
        makeMove(
          -24,
          [-24],
          [[-25, [cThree, cOne]], [-9, cThree], -8, [8, cFour]],
          0,
          180
        )
      ) // 4)
    } else if (currRotateY === -150) {
      //    _3
      //    \ \ 1
      //   2 \ \
      //      \/4
      tryMove(
        () =>
          makeMove(
            -26,
            [-25, -17, -26],
            [[-10, _cTwo], -9, -8, -1, [7, cOne], [8, cOne]],
            1,
            180
          ),
        cFour
      )
      tryMove(
        () =>
          makeMove(
            7,
            [8, 16, 7],
            [[-10, _cTwo], -9, -8, -1, [7, cOne], [8, cOne]],
            1,
            180
          ),
        [cOne, _cTwo]
      )
      tryMove(
        () =>
          makeMove(
            -8,
            [-8],
            [[-9, cThree], -8, [8, cFour], [9, [cFour, cTwo]]],
            0,
            60
          ),
        _cTwo
      )
      tryMove(() =>
        makeMove(-10, [-10], [[-9, cThree], -8, 7, [8, cFour]], 0, 180)
      )
    } else if (currRotateY === 150) {
      //      /\3
      //   1 / /
      //    /_/ 2
      //     4
      tryMove(
        () =>
          makeMove(
            -25,
            [-9, -17, -25],
            [[-25, cTwo], -24, -16, [-9, cTwo], -8, [8, cOne]],
            1,
            -180
          ),
        cThree
      )
      tryMove(
        () =>
          makeMove(
            -7,
            [9, 1, -7],
            [[-25, cTwo], -24, -16, [-9, cTwo], -8, [8, cOne]],
            1,
            -180
          ),
        [cTwo, cFour]
      )
      tryMove(
        () =>
          makeMove(
            8,
            [8],
            [[-9, cTwo], -8, [7, [cOne, cTwo]], [8, cOne]],
            0,
            -300
          ),
        cFour
      )
      tryMove(() =>
        makeMove(
          -24,
          [-24],
          [[-25, [cFour, cTwo]], [-9, cTwo], -8, [8, cOne]],
          0,
          -180
        )
      )
    } else if (currRotateY === 30) {
      //   3/\
      //    \ \ 2
      //   1 \_\
      //      4
      tryMove(
        () =>
          makeMove(
            -26,
            [-25, -17, -26],
            [[-10, _cTwo], -9, -8, -1, [7, cOne], [8, cOne]],
            1,
            -180
          ),
        [cOne, _cThree]
      )
      tryMove(
        () =>
          makeMove(
            7,
            [8, 16, 7],
            [[-10, _cTwo], -9, -8, -1, [7, cOne], [8, cOne]],
            1,
            -180
          ),
        cFour
      )
      tryMove(
        () =>
          makeMove(
            -10,
            [-10],
            [[-25, [cThree, cOne]], [-9, cThree], -8, [8, cFour]],
            0,
            -180
          ),
        _cThree
      )
      tryMove(() =>
        makeMove(
          -8,
          [-8],
          [[-9, cTwo], -8, [8, cOne], [9, [cOne, cThree]]],
          0,
          60
        )
      )
    } else if (currRotateY === -90) {
      //
      //    __1__
      //  3/_____\4
      //      2
      tryMove(
        () =>
          makeMove(
            24,
            [7, 16, 24],
            [[-9, cTwo], -8, 8, 9, 17, [25, _cOne]],
            1,
            180
          ),
        [cThree, _cFour]
      )
      tryMove(() =>
        makeMove(9, [-8, 1, 9], [[-9, cTwo], -8, 8, 9, 17, [25, _cOne]], 1, 180)
      )
      tryMove(
        () =>
          makeMove(
            -9,
            [-9],
            [[-25, [cFour, cTwo]], [-9, cTwo], -8, [8, cOne]],
            0,
            60
          ),
        cThree
      )
      tryMove(
        () =>
          makeMove(
            25,
            [25],
            [[-9, cTwo], -8, [8, cOne], [9, [cOne, cThree]]],
            0,
            180
          ),
        _cFour
      )
    } else if (currRotateY === 90) {
      //
      //   ___2___
      //  4\_____/3
      //      1
      tryMove(
        () =>
          makeMove(
            24,
            [7, 16, 24],
            [[-10, _cTwo], -9, -8, -1, [7, cOne], [8, cOne]],
            1,
            -180
          ),
        [cTwo, _cOne]
      )
      tryMove(() =>
        makeMove(
          9,
          [-8, 1, 9],
          [[-10, _cTwo], -9, -8, -1, [7, cOne], [8, cOne]],
          1,
          -180
        )
      )
      tryMove(
        () =>
          makeMove(
            -9,
            [-9],
            [[-25, [cThree, cOne]], [-9, cThree], -8, [8, cFour]],
            0,
            60
          ),
        cTwo
      )
      tryMove(
        () =>
          makeMove(
            25,
            [25],
            [[-9, cThree], -8, [8, cFour], [9, [cFour, cTwo]]],
            0,
            -180
          ),
        _cOne
      )
    }
  }

  //    console.log(`at ${currBase} and ${currRotateY}degree with ${BoardState.pieces[piece]?.restrict} and bases of ${JSON.stringify(moves.map(move => move.base))}`)
  return moves
}

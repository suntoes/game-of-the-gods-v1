/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useCallback, useEffect, useContext } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
import * as utils from '../lib/game-maths'
import * as loaders from '../lib/model-loader'
import { FENLoader, convertToFEN } from '../lib/board-loader'
import PieceHelper from '../lib/piece_structure'
import { useBoardContext } from './board-state-provider'

const Board = () => {
  const {
    isLoading,
    setIsLoading,
    setBoardState,
    setResetFunc,
    setLoadPrevFunc
  } = useBoardContext()

  // React stuffs
  const container = useRef()
  // WebGL stuffs
  const renderer = useRef()
  const camera = useRef()
  const scene = useRef()
  const raycaster = useRef()
  const mouseClick = useRef()
  const selectedPiece = useRef()
  const isCastingRay = useRef()

  // Chess stuffs
  const tileSize = 1
  const darkTone = 0x808080
  const lightTone = 0xfafafa
  const TileUUIDs = useRef()
  const BoardState = useRef()
  const moveSet = useRef()

  const handleWindowResize = useCallback(() => {
    const { current } = container
    if (current && renderer && camera) {
      const scW = current.clientWidth
      const scH = current.clientHeight

      camera.aspect = scW / scH
      camera.updateProjectionMatrix()
      renderer.setSize(scW, scH)
    }
  }, [])

  useEffect(() => {
    // Refs are predeclared to avoid Next.js' Server Side Rendering complications
    renderer = new THREE.WebGLRenderer({ antialias: true })
    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    )
    scene = new THREE.Scene()
    raycaster = new THREE.Raycaster()
    mouseClick = new THREE.Vector2()
    selectedPiece = null
    isCastingRay = false

    TileUUIDs = new Set()
    BoardState = JSON.parse(JSON.stringify(FENLoader()))
    moveSet = []

    setBoardState(BoardState)

    const init = () => {
      Promise.all([
        loaders.ModelLoaderOBJ('/res/temple.obj'), // 0
        loaders.ModelLoaderOBJ('/res/leader.obj'),
        loaders.ModelLoaderOBJ('/res/defender.obj'),
        loaders.ModelLoaderOBJ('/res/captain.obj'),
        loaders.ModelLoaderOBJ('/res/guardian.obj'), // 4
        loaders.ModelLoaderOBJ('/res/attacker.obj'),
        loaders.ModelLoaderOBJ('/res/attacker-1.obj'),
        loaders.ModelLoaderOBJ('/res/attacker-2.obj'),
        loaders.ModelLoaderOBJ('/res/defender-1.obj'), // 8
        loaders.ModelLoaderOBJ('/res/board.obj')
      ]).then(Meshes => {
        let piece
        let isBlack

        const GeneratePiece = (meshIndex, cp, variation = 0) => {
          isBlack = cp === cp.toUpperCase() // our board is coded so that uppercase represents black pieces
          piece = Meshes[meshIndex].clone()
          // piece.rotateY(utils.DegToRad(30));
          piece.scale.divide(new THREE.Vector3(1, 1, 1)) // downscales the piece by dimensions of n
          // @ts-ignore
          piece.material = new THREE.MeshPhongMaterial({
            color: isBlack ? darkTone : lightTone,
            side: THREE.DoubleSide,
            reflectivity: 0.5
          })
          piece.name = cp + (variation ? '-' + variation : '')
          piece.castShadow = true //default is false
          piece.receiveShadow = false //default
          scene.add(piece)
        }

        // Generate all temples and board
        GeneratePiece(9, 'board')
        GeneratePiece(0, 'tmp')
        GeneratePiece(0, 'tmp', 1)
        GeneratePiece(0, 'TMP')
        GeneratePiece(0, 'TMP', 1)

        // Generate all possible pieces including variations
        for (let piece in BoardState.pieces) {
          switch (piece) {
            case 'l':
            case 'L':
              GeneratePiece(1, piece)
              break
            case 'd':
            case 'D':
              GeneratePiece(2, piece)
              GeneratePiece(8, piece, 1)
              break
            case 'c':
            case 'C':
              GeneratePiece(3, piece)
              break
            case 'g':
            case 'G':
              GeneratePiece(4, piece)
              break
            case 'a':
            case 'A':
              GeneratePiece(5, piece)
              GeneratePiece(6, piece, 1)
              GeneratePiece(7, piece, 2)
              break
            default:
              break
          }
        }

        setIsLoading(false)
      })

      // Fixed for top view
      // camera.position.z = 5.49
      // camera.position.y = 30
      // camera.position.x = 0
      const windowRatio = window.innerWidth / window.innerHeight
      camera.position.z = windowRatio > 1.1 ? 0 : 6.49
      camera.position.y = windowRatio > 1.1 ? 30 : 30
      camera.position.x = windowRatio > 1.1 ? 1.49 : 1
      camera.zoom = windowRatio > 1.1 ? 1.9 : 1.3
      camera.fov = 70
      camera.updateProjectionMatrix()

      // Create the board
      let count = 0
      for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 8; j++) {
          const vertices = [1, 1, 1, -1, 1, -1, 1, -1, -1]

          const indices = [2, 1, 0]
          const tileGeom = new THREE.PolyhedronGeometry(
            vertices,
            indices,
            tileSize,
            0
          )
          const material = new THREE.MeshPhongMaterial({
            color: i % 2 ? lightTone : darkTone,
            side: THREE.DoubleSide,
            wireframe: false
          })
          const tileMesh = new THREE.Mesh(tileGeom, material)

          tileMesh.name = 'tile-' + count
          count++

          // Fixed for custom board
          tileMesh.rotateX(utils.DegToRad(i % 2 ? 35 : 55)) // 35, 45
          tileMesh.rotateY(utils.DegToRad(i % 2 ? 0 : 45)) // 0, 45
          tileMesh.rotateZ(utils.DegToRad(i % 2 ? 45 : 0)) // 45, 0

          // Fixed for board to center
          tileMesh.position.set(
            i * tileSize * 0.8125 - j * tileSize * 0.8125 + 0.25,
            -0.5 / 2,
            j * tileSize * 1.41 + (i % 2 ? 0 : 0.47) - 1.67
          )
          tileMesh.receiveShadow = true

          scene.add(tileMesh)
          TileUUIDs.add(tileMesh.uuid)
        }
      }

      const color = 0xffffff
      const intensity = 1
      const light = new THREE.DirectionalLight(color, intensity)
      light.position.set(15, 10, 10)
      //Set up shadow properties for the light
      light.shadow.mapSize.width = 2024 // default
      light.shadow.mapSize.height = 2024 // default
      light.shadow.camera.near = 1 // default
      light.shadow.camera.far = 50 // default
      light.shadow.camera.right = -20
      light.shadow.camera.left = 20
      light.shadow.camera.top = -20
      light.shadow.camera.bottom = 20
      // light.target.position.set(-5, 0, 0);
      light.castShadow = true // default false
      scene.add(light)
      scene.add(light.target)

      scene.add(new THREE.AmbientLight(0x404040))
      // scene.background = new THREE.Color( 0x505050 )

      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap

      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setAnimationLoop(updateFunc)

      const _container = container?.current
      if (_container) {
        _container.appendChild(renderer.domElement)
        const controls = new OrbitControls(camera, _container)
        controls.target.set(3.5, 0, 3.5)
        controls.update()
      }

      window.addEventListener('click', onMouseClick, false)
    }

    function onMouseClick(event) {
      mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseClick.y = -(event.clientY / window.innerHeight) * 2 + 1
      isCastingRay = true
    }

    let funcIsNotLoaded = true
    // pieces get placed on the board
    const updateFunc = time => {
      BoardState = BoardState

      // some board function passed to state provided
      if (funcIsNotLoaded) {
        const resetThis = () => {
          setBoardState(FENLoader())
          BoardState = FENLoader()
        }
        const { boardState } =
          JSON.parse(localStorage.getItem('game-of-the-gods-session')) || {}
        const prevSeshTest = boardState?.turnCount && !boardState?.winner
        const loadPrevious = () => {
          setBoardState(boardState)
          BoardState = boardState
        }

        setLoadPrevFunc(prevSeshTest ? () => loadPrevious : false)
        setResetFunc(() => resetThis)
        funcIsNotLoaded = false
      }

      // Set up the board
      for (let i = 0; i < scene.children.length; i++) {
        const child = scene.children[i]

        if ((child.name.split('-')[0] || '') === 'tile') {
          // Tile condition
          const isLight = (Math.floor(i / 8) * 7) % 2
          if (moveSet.some(move => move.indexes.includes(i)))
            // @ts-ignore
            child.material.color.set(0xff4545) // shows possible moves
          // @ts-ignore
          else if (child.material)
            // @ts-ignore
            child.material.color.set(isLight ? lightTone : darkTone) // @ts-ignore
        } else if ((child.name.split('-')[0] || '').toLowerCase() === 'tmp') {
          // Temple condition
          let templeIndex
          switch (child.name) {
            case 'tmp':
              templeIndex = 7
              break
            case 'tmp-1':
              templeIndex = 52
              break
            case 'TMP':
              templeIndex = 120
              break
            case 'TMP-1':
              templeIndex = 75
              break
            default:
              templeIndex = -1
              break
          }
          child.position.y = 0.075
          child.position.x = scene.children[templeIndex].position.x
          child.position.z = scene.children[templeIndex].position.z
        } else if (child.name === 'board') {
          //Board condition
          child.rotation.y = utils.DegToRad(30)
          child.position.x = 3.5
          child.position.y = 0.05
          child.position.z = 3.5
          child.material.color.set(0xb0b0b0)
        } else if (child.material) {
          // Piece condition
          const name = child.name.split('-')[0]
          const _variation = Number(child.name.split('-')[1]) || 0
          const { base, indexes, variation, rotateY } = BoardState.pieces[name]
          // const isShown = name === "a" && _variation === variation
          const isShown = _variation === variation

          child.position.y = isShown ? 0.0875 : 999
          child.position.x = scene.children[base].position.x
          child.position.z = scene.children[base].position.z
          child.material.visible = isShown

          // Lift chess piece on select or not
          if (name === selectedPiece && false) {
            child.position.y = 3 + Math.sin(time / 200) / 10
            child.rotation.y += 1 / 50
          } else {
            child.rotation.y = utils.DegToRad(rotateY)
          }
        }
      }

      // Handle clicks
      if (isCastingRay && !BoardState.winner) {
        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouseClick, camera)

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children)

        const pieceIntersects = intersects.filter(
          ({ object }) =>
            object.name.split('-')[0] !== 'tile' &&
            object.name.split('-')[0].toLowerCase() !== 'tmp' &&
            object.name !== 'board'
        )
        const nearestIntersect = intersects[0]
        const nearestPieceIntersect = pieceIntersects[0]
        const nearestInteresectIsTile =
          nearestIntersect?.object.name.split('-')[0] === 'tile'
        const possibleTileNumber = Number(
          nearestIntersect?.object.name.split('-')[1] || -1
        )
        const possibleMove = moveSet.filter(move =>
          move.indexes.includes(possibleTileNumber)
        )[0]

        if (nearestInteresectIsTile && possibleMove) {
          // If valid move
          BoardState.pieces[selectedPiece] = {
            base: possibleMove.base,
            indexes: possibleMove.indexes,
            restrict: possibleMove?.restrict || [],
            variation: possibleMove.variation,
            rotateY:
              BoardState.pieces[selectedPiece].rotateY + possibleMove.rotateY
          }
          BoardState.turnCount = BoardState.turnCount + 1
          BoardState.winner =
            utils.DetectWinByTemple(BoardState) ||
            utils.DetectWinByCrush(BoardState) ||
            utils.DetectWinByTrap(BoardState)

          selectedPiece = undefined
          moveSet = []
          setBoardState(JSON.parse(JSON.stringify(BoardState)))
        } else if (nearestPieceIntersect) {
          // If player picked a piece
          const select = nearestPieceIntersect.object.name.split('-')[0]
          const { currentTurn: turn } = utils.TurnCountToSystem(
            BoardState.turnCount
          )

          const turnPieceIsPicked =
            (turn === 'l' && PieceHelper.isLight(select)) ||
            (turn === 'd' && PieceHelper.isDark(select))
          //            || true

          if (turnPieceIsPicked) {
            selectedPiece = nearestPieceIntersect.object.name.split('-')[0]
            const rawMoveSet = PieceHelper.getMoveSet(selectedPiece, BoardState)
            moveSet = utils.ValidateMoveSet(
              selectedPiece,
              rawMoveSet,
              BoardState
            )
          }
        } else if (intersects.length) {
          // If player cliked to nothing
          selectedPiece = undefined
          moveSet = []
        }

        isCastingRay = false
      }

      renderer.setClearColor(0xffffff, 0)
      renderer.render(scene, camera)
    }

    init()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize, false)
    return () => {
      window.removeEventListener('resize', handleWindowResize, false)
    }
  }, [handleWindowResize])

  return <div ref={container} />
}

export default Board

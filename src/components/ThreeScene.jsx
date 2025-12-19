import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Octree } from 'three/addons/math/Octree.js'
import { Capsule } from 'three/addons/math/Capsule.js'
import gsap from 'gsap'
import { Howl } from 'howler'

const GRAVITY = 30
const CAPSULE_RADIUS = 0.35
const CAPSULE_HEIGHT = 1
const JUMP_HEIGHT = 11
const MOVE_SPEED = 7

const intersectObjectsNames = [
  'Project_1', 'Project_2', 'Project_3', 'Picnic',
  'Squirtle', 'Chicken', 'Pikachu', 'Bulbasaur',
  'Charmander', 'Snorlax', 'Chest'
]

const pokemonNames = ['Bulbasaur', 'Chicken', 'Pikachu', 'Charmander', 'Squirtle', 'Snorlax']

function ThreeScene({ 
  onModelLoadedRef, 
  onShowModalRef, 
  pressedButtons, 
  isMuted, 
  isDarkTheme,
  isModalOpen,
  soundsRef
}) {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const characterRef = useRef({
    instance: null,
    isMoving: false,
    spawnPosition: new THREE.Vector3()
  })
  const playerColliderRef = useRef(null)
  const colliderOctreeRef = useRef(null)
  const playerVelocityRef = useRef(new THREE.Vector3())
  const playerOnFloorRef = useRef(false)
  const targetRotationRef = useRef(Math.PI / 2)
  const intersectObjectsRef = useRef([])
  const raycasterRef = useRef(new THREE.Raycaster())
  const pointerRef = useRef(new THREE.Vector2())
  const sunRef = useRef(null)
  const lightRef = useRef(null)
  const isCharacterReadyRef = useRef(true)
  const animationIdRef = useRef(null)
  const pressedButtonsRef = useRef(pressedButtons)
  const isMutedRef = useRef(isMuted)
  const isModalOpenRef = useRef(isModalOpen)

  useEffect(() => {
    pressedButtonsRef.current = pressedButtons
  }, [pressedButtons])

  useEffect(() => {
    isMutedRef.current = isMuted
  }, [isMuted])

  useEffect(() => {
    isModalOpenRef.current = isModalOpen
  }, [isModalOpen])

  useEffect(() => {
    if (!sunRef.current || !lightRef.current) return

    gsap.to(lightRef.current.color, {
      r: isDarkTheme ? 0.25 : 1.0,
      g: isDarkTheme ? 0.31 : 1.0,
      b: isDarkTheme ? 0.78 : 1.0,
      duration: 1,
      ease: 'power2.inOut'
    })

    gsap.to(lightRef.current, {
      intensity: isDarkTheme ? 0.9 : 0.8,
      duration: 1,
      ease: 'power2.inOut'
    })

    gsap.to(sunRef.current, {
      intensity: isDarkTheme ? 0.8 : 1,
      duration: 1,
      ease: 'power2.inOut'
    })

    gsap.to(sunRef.current.color, {
      r: isDarkTheme ? 0.25 : 1.0,
      g: isDarkTheme ? 0.41 : 1.0,
      b: isDarkTheme ? 0.88 : 1.0,
      duration: 1,
      ease: 'power2.inOut'
    })
  }, [isDarkTheme])

  useEffect(() => {
    soundsRef.current = {
      backgroundMusic: new Howl({
        src: ['/sfx/music.ogg'],
        loop: true,
        volume: 0.3,
        preload: true
      }),
      projectsSFX: new Howl({
        src: ['/sfx/projects.ogg'],
        volume: 0.5,
        preload: true
      }),
      pokemonSFX: new Howl({
        src: ['/sfx/pokemon.ogg'],
        volume: 0.5,
        preload: true
      }),
      jumpSFX: new Howl({
        src: ['/sfx/jumpsfx.ogg'],
        volume: 1.0,
        preload: true
      })
    }

    return () => {
      Object.values(soundsRef.current || {}).forEach(sound => {
        if (sound && sound.unload) sound.unload()
      })
    }
  }, [soundsRef])

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xaec972)
    sceneRef.current = scene

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.shadowMap.enabled = true
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.7
    rendererRef.current = renderer

    const aspect = sizes.width / sizes.height
    const camera = new THREE.OrthographicCamera(
      -aspect * 50, aspect * 50, 50, -50, 1, 1000
    )
    camera.position.set(-13, 39, -67)
    camera.zoom = 2.2
    camera.updateProjectionMatrix()
    cameraRef.current = camera

    const cameraOffset = new THREE.Vector3(-13, 39, -67)

    const controls = new OrbitControls(camera, canvasRef.current)
    controls.update()

    const sun = new THREE.DirectionalLight(0xffffff)
    sun.castShadow = true
    sun.position.set(280, 200, -80)
    sun.target.position.set(100, 0, -10)
    sun.shadow.mapSize.width = 4096
    sun.shadow.mapSize.height = 4096
    sun.shadow.camera.left = -150
    sun.shadow.camera.right = 300
    sun.shadow.camera.top = 150
    sun.shadow.camera.bottom = -100
    sun.shadow.normalBias = 0.2
    scene.add(sun.target)
    scene.add(sun)
    sunRef.current = sun

    const light = new THREE.AmbientLight(0x404040, 2.7)
    scene.add(light)
    lightRef.current = light

    const colliderOctree = new Octree()
    colliderOctreeRef.current = colliderOctree

    const playerCollider = new Capsule(
      new THREE.Vector3(0, CAPSULE_RADIUS, 0),
      new THREE.Vector3(0, CAPSULE_HEIGHT, 0),
      CAPSULE_RADIUS
    )
    playerColliderRef.current = playerCollider

    const manager = new THREE.LoadingManager()
    manager.onLoad = () => {
      if (onModelLoadedRef.current) {
        onModelLoadedRef.current()
      }
    }

    const loader = new GLTFLoader(manager)
    loader.load(
      '/Portfolio.glb',
      (glb) => {
        glb.scene.traverse((child) => {
          if (intersectObjectsNames.includes(child.name)) {
            intersectObjectsRef.current.push(child)
          }
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
          if (child.name === 'Character') {
            characterRef.current.spawnPosition.copy(child.position)
            characterRef.current.instance = child
            playerCollider.start.copy(child.position).add(new THREE.Vector3(0, CAPSULE_RADIUS, 0))
            playerCollider.end.copy(child.position).add(new THREE.Vector3(0, CAPSULE_HEIGHT, 0))
          }
          if (child.name === 'Ground_Collider') {
            colliderOctree.fromGraphNode(child)
            child.visible = false
          }
        })
        scene.add(glb.scene)
      },
      undefined,
      (error) => console.error(error)
    )

    const jumpCharacter = (meshID) => {
      if (!isCharacterReadyRef.current) return

      const mesh = scene.getObjectByName(meshID)
      if (!mesh) return
      
      const jumpHeight = 2
      const jumpDuration = 0.5
      const isSnorlax = meshID === 'Snorlax'

      const currentScale = { x: mesh.scale.x, y: mesh.scale.y, z: mesh.scale.z }

      const t1 = gsap.timeline()

      t1.to(mesh.scale, {
        x: isSnorlax ? currentScale.x * 1.2 : 1.2,
        y: isSnorlax ? currentScale.y * 0.8 : 0.8,
        z: isSnorlax ? currentScale.z * 1.2 : 1.2,
        duration: jumpDuration * 0.2,
        ease: 'power2.out'
      })

      t1.to(mesh.scale, {
        x: isSnorlax ? currentScale.x * 0.8 : 0.8,
        y: isSnorlax ? currentScale.y * 1.3 : 1.3,
        z: isSnorlax ? currentScale.z * 0.8 : 0.8,
        duration: jumpDuration * 0.3,
        ease: 'power2.out'
      })

      t1.to(mesh.position, {
        y: mesh.position.y + jumpHeight,
        duration: jumpDuration * 0.5,
        ease: 'power2.out'
      }, '<')

      t1.to(mesh.scale, {
        x: isSnorlax ? currentScale.x * 1.2 : 1,
        y: isSnorlax ? currentScale.y * 1.2 : 1,
        z: isSnorlax ? currentScale.z * 1.2 : 1,
        duration: jumpDuration * 0.3,
        ease: 'power1.inOut'
      })

      t1.to(mesh.position, {
        y: mesh.position.y,
        duration: jumpDuration * 0.5,
        ease: 'bounce.out',
        onComplete: () => { isCharacterReadyRef.current = true }
      }, '>')

      if (!isSnorlax) {
        t1.to(mesh.scale, {
          x: 1, y: 1, z: 1,
          duration: jumpDuration * 0.2,
          ease: 'elastic.out(1, 0.3)'
        })
      }
    }

    const handleInteraction = () => {
      if (isModalOpenRef.current) return

      raycasterRef.current.setFromCamera(pointerRef.current, camera)
      const intersects = raycasterRef.current.intersectObjects(intersectObjectsRef.current)

      if (intersects.length > 0) {
        const intersectObject = intersects[0].object.parent.name

        if (pokemonNames.includes(intersectObject)) {
          if (isCharacterReadyRef.current) {
            if (!isMutedRef.current && soundsRef.current) {
              soundsRef.current.pokemonSFX.play()
            }
            jumpCharacter(intersectObject)
            isCharacterReadyRef.current = false
          }
        } else if (intersectObject) {
          if (onShowModalRef.current) {
            onShowModalRef.current(intersectObject)
          }
        }
      }
    }

    let touchHappened = false

    const onClick = () => {
      if (touchHappened) return
      handleInteraction()
    }

    const onMouseMove = (event) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointerRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
      touchHappened = false
    }

    const onTouchEnd = (event) => {
      if (event.changedTouches && event.changedTouches[0]) {
        pointerRef.current.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1
        pointerRef.current.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1
      }
      touchHappened = true
      handleInteraction()
    }

    const onResize = () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
      const newAspect = sizes.width / sizes.height
      camera.left = -newAspect * 50
      camera.right = newAspect * 50
      camera.top = 50
      camera.bottom = -50
      camera.updateProjectionMatrix()
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    const respawnCharacter = () => {
      if (!characterRef.current.instance) return
      characterRef.current.instance.position.copy(characterRef.current.spawnPosition)
      playerCollider.start.copy(characterRef.current.spawnPosition).add(new THREE.Vector3(0, CAPSULE_RADIUS, 0))
      playerCollider.end.copy(characterRef.current.spawnPosition).add(new THREE.Vector3(0, CAPSULE_HEIGHT, 0))
      playerVelocityRef.current.set(0, 0, 0)
      characterRef.current.isMoving = false
    }

    const playerCollisions = () => {
      const result = colliderOctree.capsuleIntersect(playerCollider)
      playerOnFloorRef.current = false

      if (result) {
        playerOnFloorRef.current = result.normal.y > 0
        playerCollider.translate(result.normal.multiplyScalar(result.depth))

        if (playerOnFloorRef.current) {
          characterRef.current.isMoving = false
          playerVelocityRef.current.x = 0
          playerVelocityRef.current.z = 0
        }
      }
    }

    const updatePlayer = () => {
      if (!characterRef.current.instance) return

      if (characterRef.current.instance.position.y < -20) {
        respawnCharacter()
        return
      }

      if (!playerOnFloorRef.current) {
        playerVelocityRef.current.y -= GRAVITY * 0.035
      }

      playerCollider.translate(playerVelocityRef.current.clone().multiplyScalar(0.035))
      playerCollisions()

      characterRef.current.instance.position.copy(playerCollider.start)
      characterRef.current.instance.position.y -= CAPSULE_RADIUS

      let rotationDiff = ((((targetRotationRef.current - characterRef.current.instance.rotation.y) % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI
      let finalRotation = characterRef.current.instance.rotation.y + rotationDiff

      characterRef.current.instance.rotation.y = THREE.MathUtils.lerp(
        characterRef.current.instance.rotation.y,
        finalRotation,
        0.4
      )
    }

    const handleJumpAnimation = () => {
      if (!characterRef.current.instance || !characterRef.current.isMoving) return

      const jumpDuration = 0.5

      const t1 = gsap.timeline()

      t1.to(characterRef.current.instance.scale, {
        x: 1.08, y: 0.9, z: 1.08,
        duration: jumpDuration * 0.2,
        ease: 'power2.out'
      })

      t1.to(characterRef.current.instance.scale, {
        x: 0.92, y: 1.1, z: 0.92,
        duration: jumpDuration * 0.3,
        ease: 'power2.out'
      })

      t1.to(characterRef.current.instance.scale, {
        x: 1, y: 1, z: 1,
        duration: jumpDuration * 0.3,
        ease: 'power1.inOut'
      })

      t1.to(characterRef.current.instance.scale, {
        x: 1, y: 1, z: 1,
        duration: jumpDuration * 0.2
      })
    }

    const handleContinuousMovement = () => {
      if (!characterRef.current.instance) return

      const buttons = pressedButtonsRef.current
      if (Object.values(buttons).some(pressed => pressed) && !characterRef.current.isMoving) {
        if (!isMutedRef.current && soundsRef.current) {
          soundsRef.current.jumpSFX.play()
        }
        if (buttons.up) {
          playerVelocityRef.current.z += MOVE_SPEED
          targetRotationRef.current = 0
        }
        if (buttons.down) {
          playerVelocityRef.current.z -= MOVE_SPEED
          targetRotationRef.current = Math.PI
        }
        if (buttons.left) {
          playerVelocityRef.current.x += MOVE_SPEED
          targetRotationRef.current = Math.PI / 2
        }
        if (buttons.right) {
          playerVelocityRef.current.x -= MOVE_SPEED
          targetRotationRef.current = -Math.PI / 2
        }

        playerVelocityRef.current.y = JUMP_HEIGHT
        characterRef.current.isMoving = true
        handleJumpAnimation()
      }
    }

    const onKeyDown = (event) => {
      if (event.code.toLowerCase() === 'keyr') {
        respawnCharacter()
      }
    }

    const animate = () => {
      updatePlayer()
      handleContinuousMovement()

      if (characterRef.current.instance) {
        const targetCameraPosition = new THREE.Vector3(
          characterRef.current.instance.position.x + cameraOffset.x - 20,
          cameraOffset.y,
          characterRef.current.instance.position.z + cameraOffset.z + 30
        )
        camera.position.copy(targetCameraPosition)
        camera.lookAt(
          characterRef.current.instance.position.x + 10,
          camera.position.y - 39,
          characterRef.current.instance.position.z + 10
        )
      }

      raycasterRef.current.setFromCamera(pointerRef.current, camera)
      const intersects = raycasterRef.current.intersectObjects(intersectObjectsRef.current)

      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer'
      } else {
        document.body.style.cursor = 'default'
      }

      renderer.render(scene, camera)
      animationIdRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('click', onClick, { passive: false })
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchend', onTouchEnd, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    animate()

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('click', onClick)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      
      renderer.dispose()
    }
  }, [])

  return <canvas id="experience-canvas" ref={canvasRef} />
}

export default ThreeScene

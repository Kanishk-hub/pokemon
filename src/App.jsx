import { useState, useRef, useEffect, useCallback } from 'react'
import LoadingScreen from './components/LoadingScreen'
import ThemeToggle from './components/ThemeToggle'
import AudioToggle from './components/AudioToggle'
import Modal from './components/Modal'
import MobileControls from './components/MobileControls'
import ThreeScene from './components/ThreeScene'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [pressedButtons, setPressedButtons] = useState({
    up: false,
    down: false,
    left: false,
    right: false
  })
  
  const soundsRef = useRef(null)
  const onModelLoadedRef = useRef(null)
  const onShowModalRef = useRef(null)

  const modalData = {
    Project_1: {
      title: "🍜Recipe Finder👩🏻‍🍳",
      content: "Let's get cooking! This project uses TheMealDB API for some recipes and populates my React card components. This shows my skills in working with consistent design systems using components. There is also pagination to switch pages.",
      link: "https://example.com/",
    },
    Project_2: {
      title: "📋ToDo List✏️",
      content: "Keeping up with everything is really exhausting so I wanted to create my own ToDo list app. But I wanted my ToDo list to look like an actual ToDo list so I used Tailwind CSS for consistency and also did state management with React hooks like useState.",
      link: "https://example.com/",
    },
    Project_3: {
      title: "🌞Weather App😎",
      content: "Rise and shine as they say (but sometimes it's not all that shiny outside). Using a location-based API the user can automatically detect their location and my application will show them the weather near them. I also put some of my design skills to use using Figma.",
      link: "https://example.com/",
    },
    Chest: {
      title: "💁‍♀️ About Me",
      content: "Hi you found my chest👋, I'm Bella Xu and I am an aspiring creative developer and designer. I just started web development this year! In the signs, you will see some of my most recent projects that I'm proud of. I hope to add a lot more in the future. In my free time, I like to draw, watch TV shows (especially Pokémon), do clay sculpting and needle felting. Reach out if you wanna chat. Bella is OUT!!! 🏃‍♀️",
    },
    Picnic: {
      title: "🍷 Uggh yesss 🧺",
      content: " Picnics are my thanggg don't @ me. Lying down with some good grape juice inna wine glass and a nice book at a park is my total vibe. If this isn't max aura points 💯 idk what is.",
    },
  }

  const playSound = useCallback((soundId) => {
    if (soundsRef.current && soundsRef.current[soundId]) {
      soundsRef.current[soundId].play()
    }
  }, [])

  const handleEnterPark = () => {
    setIsLoading(false)
    if (!isMuted) {
      playSound('projectsSFX')
      playSound('backgroundMusic')
    }
  }

  const handleModelLoaded = useCallback(() => {
    setIsLoaded(true)
  }, [])

  const handleShowModal = useCallback((id) => {
    const content = modalData[id]
    if (content) {
      setModalContent(content)
    }
  }, [])

  onModelLoadedRef.current = handleModelLoaded
  onShowModalRef.current = handleShowModal

  const handleCloseModal = () => {
    setModalContent(null)
    if (!isMuted) {
      playSound('projectsSFX')
    }
  }

  const handleToggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
    if (!isMuted) {
      playSound('projectsSFX')
    }
  }

  const handleToggleAudio = () => {
    if (!isMuted) {
      playSound('projectsSFX')
    }
    setIsMuted(!isMuted)
    if (soundsRef.current) {
      if (!isMuted) {
        soundsRef.current.backgroundMusic.pause()
      } else {
        soundsRef.current.backgroundMusic.play()
      }
    }
  }

  const handleMobileControlStart = (direction) => {
    setPressedButtons(prev => ({ ...prev, [direction]: true }))
  }

  const handleMobileControlEnd = (direction) => {
    setPressedButtons(prev => ({ ...prev, [direction]: false }))
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.code.toLowerCase()) {
        case 'keyw':
        case 'arrowup':
          setPressedButtons(prev => ({ ...prev, up: true }))
          break
        case 'keys':
        case 'arrowdown':
          setPressedButtons(prev => ({ ...prev, down: true }))
          break
        case 'keya':
        case 'arrowleft':
          setPressedButtons(prev => ({ ...prev, left: true }))
          break
        case 'keyd':
        case 'arrowright':
          setPressedButtons(prev => ({ ...prev, right: true }))
          break
      }
    }

    const handleKeyUp = (event) => {
      switch (event.code.toLowerCase()) {
        case 'keyw':
        case 'arrowup':
          setPressedButtons(prev => ({ ...prev, up: false }))
          break
        case 'keys':
        case 'arrowdown':
          setPressedButtons(prev => ({ ...prev, down: false }))
          break
        case 'keya':
        case 'arrowleft':
          setPressedButtons(prev => ({ ...prev, left: false }))
          break
        case 'keyd':
        case 'arrowright':
          setPressedButtons(prev => ({ ...prev, right: false }))
          break
      }
    }

    const handleBlur = () => {
      setPressedButtons({ up: false, down: false, left: false, right: false })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  return (
    <div className={isDarkTheme ? 'dark-theme' : 'light-theme'}>
      <div id="experience">
        <ThreeScene 
          onModelLoadedRef={onModelLoadedRef}
          onShowModalRef={onShowModalRef}
          pressedButtons={pressedButtons}
          isMuted={isMuted}
          isDarkTheme={isDarkTheme}
          isModalOpen={modalContent !== null}
          soundsRef={soundsRef}
        />
      </div>

      {isLoading && (
        <LoadingScreen 
          isLoaded={isLoaded} 
          onEnter={handleEnterPark} 
        />
      )}

      <ThemeToggle 
        isDarkTheme={isDarkTheme} 
        onToggle={handleToggleTheme} 
      />

      <AudioToggle 
        isMuted={isMuted} 
        onToggle={handleToggleAudio} 
      />

      {modalContent && (
        <Modal 
          title={modalContent.title}
          content={modalContent.content}
          link={modalContent.link}
          onClose={handleCloseModal}
        />
      )}

      <MobileControls 
        onControlStart={handleMobileControlStart}
        onControlEnd={handleMobileControlEnd}
      />
    </div>
  )
}

export default App

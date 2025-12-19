# Bella's Park - React 3D Portfolio

## Overview
An interactive 3D portfolio website built with React, Vite, and Three.js. Users can explore a 3D park environment using arrow keys or mobile controls to learn about Bella and view projects. Converted from vanilla HTML/CSS/JS to React for better component structure and state management.

## Project Structure
- `src/App.jsx` - Main React app with state management (theme, audio, modal, keyboard input)
- `src/components/ThreeScene.jsx` - Three.js canvas component with 3D rendering, physics, and interactivity
- `src/components/LoadingScreen.jsx` - Loading screen UI
- `src/components/ThemeToggle.jsx` - Day/night theme toggle button
- `src/components/AudioToggle.jsx` - Audio on/off button
- `src/components/Modal.jsx` - Project detail modal
- `src/components/MobileControls.jsx` - Mobile touch controls
- `public/` - Static assets (Portfolio.glb, sfx, media)
- `index.html` - Vite entry point
- `vite.config.js` - Vite configuration with allowedHosts for Replit

## Technologies
- React 18 with Hooks (useState, useRef, useEffect, useCallback)
- Vite - Fast build tool and dev server
- Three.js - 3D rendering with OrbitControls, GLTFLoader, physics (Octree, Capsule)
- GSAP - Animations for character jumps and theme transitions
- Howler.js - Audio management (background music, sound effects)

## Key Design Decisions
- **Scene Initialization**: Three.js scene runs only once on mount (empty useEffect dependency) to prevent re-renders from restarting the 3D engine
- **Ref-Based State**: Used refs for frequently changing state (pressed buttons, mute status, modal state) to avoid unnecessary re-renders
- **Callback Stability**: Used refs for onModelLoaded and onShowModal to maintain stable references while allowing parent component state updates

## Running Locally
```bash
npm run dev
```
Server runs on port 5000.

## Build
```bash
npm run build
```
Output in `dist/` folder for deployment.

## Features
- First-person 3D navigation with physics/collision
- Day/night theme toggle with dynamic lighting
- Audio toggle with background music and sound effects
- Mobile touch controls
- Project modals for showcasing work
- Character with jump animation
- Interactive Pokémon encounters

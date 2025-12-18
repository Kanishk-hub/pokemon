# Bella's Park - 3D Portfolio (React)

## Overview
An interactive 3D portfolio website built with React and Three.js. Users can explore a 3D park environment using arrow keys or mobile controls to learn about Bella and view projects.

## Project Structure
```
src/
  components/
    ThreeScene.jsx     - Main Three.js scene with 3D rendering and physics
    LoadingScreen.jsx  - Loading/enter screen component
    ThemeToggle.jsx    - Day/night theme toggle button
    AudioToggle.jsx    - Sound on/off toggle button
    Modal.jsx          - Project info modal component
    MobileControls.jsx - Touch controls for mobile devices
  App.jsx              - Main React app with state management
  App.css              - All styles
  main.jsx             - React entry point
  index.css            - Global styles and font import
public/
  Portfolio.glb        - 3D model of the park environment
  sfx/                 - Audio files (music, sound effects)
  media/               - Favicons and social media images
```

## Technologies
- React 19 with Vite
- Three.js - 3D rendering
- GSAP - Animations
- Howler.js - Audio management

## Development
```bash
npm run dev
```
Runs on port 5000.

## Build
```bash
npm run build
```
Outputs to `dist/` folder for static deployment.

## Features
- First-person 3D navigation with physics/collision
- Day/night theme toggle with lighting changes
- Audio toggle with background music and sound effects
- Mobile touch controls (visible on screens < 1100px)
- Project modals for showcasing work
- Pokemon character interactions with bounce animations

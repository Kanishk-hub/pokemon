# Bella's Park - 3D Portfolio

## Overview
An interactive 3D portfolio website built with Three.js. Users can explore a 3D park environment using arrow keys or mobile controls to learn about Bella and view projects.

## Project Structure
- `index.html` - Main HTML page with UI elements and import maps for Three.js
- `main.js` - Three.js application with 3D scene, physics, and interactivity
- `style.css` - Styling for UI elements, modals, and controls
- `server.js` - Simple Node.js static file server
- `Portfolio.glb` - 3D model of the park environment
- `sfx/` - Audio files (music, sound effects)
- `media/` - Favicons and social media images
- `Other Stuff/` - Development assets and old code

## Technologies
- Three.js (via CDN import map) - 3D rendering
- GSAP - Animations
- Howler.js - Audio management
- Vanilla JavaScript - No build tools required

## Running Locally
```bash
node server.js
```
Server runs on port 5000.

## Features
- First-person 3D navigation with physics/collision
- Day/night theme toggle
- Audio toggle with background music and sound effects
- Mobile touch controls
- Project modals for showcasing work

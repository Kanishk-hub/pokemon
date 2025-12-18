function LoadingScreen({ isLoaded, onEnter }) {
  return (
    <div className="loading-screen">
      {!isLoaded && <div className="loading-text">Loading...</div>}
      <button 
        className={`enter-button ${isLoaded ? 'visible' : ''}`}
        onClick={onEnter}
        style={{ opacity: isLoaded ? 1 : 0 }}
      >
        Enter Park!
      </button>
      <div className="instructions">~ use arrow keys to move ~</div>
    </div>
  )
}

export default LoadingScreen

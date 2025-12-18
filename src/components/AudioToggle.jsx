function AudioToggle({ isMuted, onToggle }) {
  return (
    <div className="audio-toggle-button" onClick={onToggle}>
      <svg
        width="102"
        height="69"
        viewBox="0 0 102 69"
        className={`first-icon-two ${isMuted ? 'hidden' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: isMuted ? 'none' : 'block' }}
      >
        <rect y="17" width="24" height="37" fill="white" />
        <rect x="39" width="24" height="69" fill="white" />
        <rect x="78" y="12" width="24" height="42" fill="white" />
      </svg>

      <svg
        width="102"
        height="24"
        viewBox="0 0 102 24"
        className={`second-icon-two ${isMuted ? 'visible' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: isMuted ? 'block' : 'none' }}
      >
        <rect width="24" height="24" fill="white" />
        <rect x="39" width="24" height="24" fill="white" />
        <rect x="78" width="24" height="24" fill="white" />
      </svg>
    </div>
  )
}

export default AudioToggle

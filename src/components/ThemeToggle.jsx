function ThemeToggle({ isDarkTheme, onToggle }) {
  return (
    <div className="theme-mode-toggle-button" onClick={onToggle}>
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        className={`first-icon ${isDarkTheme ? 'hidden' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: isDarkTheme ? 'none' : 'block' }}
      >
        <rect x="25" y="25" width="30" height="30" fill="white" />
        <rect width="4" height="19" transform="matrix(-1 0 0 1 42 0)" fill="white" />
        <rect width="4" height="19" transform="matrix(-1 0 0 1 42 61)" fill="white" />
        <rect width="4" height="19" transform="matrix(0 -1 -1 0 80 42)" fill="white" />
        <rect width="4" height="14" transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 18.8994 22.728)" fill="white" />
        <rect width="4" height="14" transform="matrix(0.719888 0.69409 -0.719888 0.69409 19.0786 59.0491)" fill="white" />
        <rect width="4" height="14" transform="matrix(0.707107 0.707107 0.707107 -0.707107 58 19.8994)" fill="white" />
        <rect width="4" height="14" transform="matrix(0.719888 -0.69409 0.719888 0.69409 58.1792 61.7764)" fill="white" />
        <rect width="4" height="19" transform="matrix(0 -1 -1 0 19 42)" fill="white" />
      </svg>

      <svg
        width="46"
        height="46"
        viewBox="0 0 46 46"
        className={`second-icon ${isDarkTheme ? 'visible' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: isDarkTheme ? 'block' : 'none' }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.8333 0H46V46H0V26.8333H26.8333V0ZM34 12H41.6667V19.6667H34V12ZM33.2222 26.8333H40.8889V34.5H33.2222V26.8333ZM23 33.2222H15.3333V40.8889H23V33.2222Z"
          fill="white"
        />
      </svg>
    </div>
  )
}

export default ThemeToggle

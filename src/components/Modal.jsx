function Modal({ title, content, link, onClose }) {
  return (
    <>
      <div className="modal-bg-overlay" onClick={onClose}></div>
      <div className="modal">
        <div className="modal-wrapper">
          <div className="modal-header">
            <h1 className="modal-title">{title}</h1>
            <button className="modal-exit-button" onClick={onClose}>exit</button>
          </div>
          <div className="modal-content">
            <div className="modal-content-wrapper">
              <p className="modal-project-description">{content}</p>
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-project-visit-button"
                >
                  View Project
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal

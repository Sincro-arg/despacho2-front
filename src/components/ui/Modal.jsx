import './Modal.css';

export function Modal({ titulo, onCerrar, children }) {
  return (
    <div className="modal__overlay" onClick={onCerrar}>
      <div className="modal__contenido" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h2 className="modal__titulo">{titulo}</h2>
          <button type="button" className="modal__cerrar" onClick={onCerrar} aria-label="Cerrar">
            &times;
          </button>
        </header>
        <div className="modal__cuerpo">{children}</div>
      </div>
    </div>
  );
}

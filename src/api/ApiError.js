// El back no respondio: red caida, servidor abajo, o tardo demasiado.
export class ApiConnectionError extends Error {
  constructor(message = 'No se pudo conectar con el servidor.') {
    super(message);
    this.name = 'ApiConnectionError';
  }
}

// El back respondio pero con un error (4xx/5xx). El mensaje ya viene
// armado por el errorHandler del back.
export class ApiResponseError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiResponseError';
    this.status = status;
  }
}

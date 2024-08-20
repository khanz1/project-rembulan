export class Config {
  static readonly SERVER_BASE_URL =
    import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:3000';
  static readonly HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
  } as const;

  static readonly getAccessToken = () => localStorage.getItem('token');
}

// AuthService contains authentication-related API calls
export class AuthService {

  // The HTTP context used to send API requests
  constructor(private context: any) {}

  // Request an authentication token using username and password
  async token(username: string, password: string) {
    return await this.context.post('/auth', {
      data: { username, password }
    });
  }
}
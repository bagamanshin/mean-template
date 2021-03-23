export enum roles {
  GUEST = 'GUEST',
  AUTH_USER = 'AUTH_USER',
  ADMIN = 'ADMIN'
}

export enum defaultRouteToRole {
  GUEST = '/',
  AUTH_USER = '/inner',
  ADMIN = '/admin'
}

export interface User {
  email: string
  password: string
}

export interface AuthorizedUser {
  id: string
  firstName: string
  lastName: string
  username: string
  role: string
  jwtToken: string
  refreshToken: string
}

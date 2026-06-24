import axiosClient from './axiosClient'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await axiosClient.post<AuthResponse>('/auth/login', data)
  return response.data
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await axiosClient.post<AuthResponse>('/auth/register', data)
  return response.data
}
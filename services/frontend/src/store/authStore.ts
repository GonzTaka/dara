import {create} from 'zustand'


// created interface for auth state containing the expected properties
interface AuthState {
    token: string | null
    login: (token: string) => void
    logout: () => void
}

// created a custom hook to use the auth store
export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    login: (token) => set({ token }),
    logout: () => set({ token: null })
}))

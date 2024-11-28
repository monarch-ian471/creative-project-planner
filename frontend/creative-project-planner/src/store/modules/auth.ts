// src/store/modules/auth.ts
import { Module } from 'vuex'
import { RootState } from '../index'
import router from '@/router'

// Define the shape of authentication state
export interface AuthState {
  token: string | null
  isAuthenticated: boolean
  loginError: string | null
}

// User interface for type safety
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

// Initial state
const state: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loginError: null
}

export const authModule: Module<AuthState, RootState> = {
  namespaced: true,
  
  state,
  
  mutations: {
    SET_TOKEN(state, token: string | null) {
      state.token = token
      state.isAuthenticated = !!token
      state.loginError = null
      
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    
    SET_LOGIN_ERROR(state, error: string | null) {
      state.loginError = error
    },
    
    LOGOUT(state) {
      state.token = null
      state.isAuthenticated = false
      state.loginError = null
      localStorage.removeItem('token')
    }
  },
  
  actions: {
    async login({ commit, dispatch }, credentials: { email: string, password: string }) {
      try {
        // Simulated login logic - replace with actual API call
        const response = await simulateLoginAPI(credentials)
        
        const { user, token } = response
        
        commit('SET_TOKEN', token)
        commit('user/SET_USER', user, { root: true })
        
        // Redirect to dashboard or intended page
        router.push({ 
          name: 'Dashboard', 
          query: router.currentRoute.value.query.redirect 
            ? { redirect: router.currentRoute.value.query.redirect as string } 
            : {} 
        })
      } catch (error) {
        commit('SET_LOGIN_ERROR', error instanceof Error ? error.message : 'Login failed')
      }
    },
    
    logout({ commit }) {
      commit('LOGOUT')
      commit('user/SET_USER', null, { root: true })
      router.push({ name: 'Login' })
    }
  },
  
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    getToken: state => state.token,
    getLoginError: state => state.loginError
  }
}

// Simulated login API (replace with actual API call)
async function simulateLoginAPI(credentials: { email: string, password: string }) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock authentication logic
  if (credentials.email === 'user@example.com' && credentials.password === 'password') {
    return {
      user: {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe'
      },
      token: 'mock-jwt-token'
    }
  } else {
    throw new Error('Invalid credentials')
  }
}
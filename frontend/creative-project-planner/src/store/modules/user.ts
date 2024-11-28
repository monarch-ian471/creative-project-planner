// src/store/modules/user.ts
import { Module } from 'vuex'
import { RootState } from '../index'
import { User } from './auth'

export interface UserState {
  userData: User | null
}

const state: UserState = {
  userData: JSON.parse(localStorage.getItem('user') || 'null')
}

export const userModule: Module<UserState, RootState> = {
  namespaced: true,
  
  state,
  
  mutations: {
    SET_USER(state, userData: User | null) {
      state.userData = userData
      
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData))
      } else {
        localStorage.removeItem('user')
      }
    }
  },
  
  actions: {
    updateUser({ commit }, userData: User) {
      commit('SET_USER', userData)
    },
    
    clearUser({ commit }) {
      commit('SET_USER', null)
    }
  },
  
  getters: {
    getUserData: state => state.userData,
    getUserId: state => state.userData?.id,
    getUserEmail: state => state.userData?.email
  }
}

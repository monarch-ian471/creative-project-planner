// src/store/index.ts
import { createStore, Store } from 'vuex'
import { AuthState, authModule } from './modules/auth'
import { UserState, userModule } from './modules/user'

export interface RootState {
  version: string
}

export interface State extends RootState {
  auth: AuthState
  user: UserState
}

export default createStore<State>({
  state: {
    version: '1.0.0'
  },
  modules: {
    auth: authModule,
    user: userModule
  }
})
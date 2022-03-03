import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { AudioTrack } from '~/types/Audio'

export const state = () => ({
    currentTrack: null as AudioTrack | null,
    volume: 0.5 as number
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
    currentTrack: state => state.currentTrack,
    volume: state => state.volume
}

export const mutations: MutationTree<RootState> = {
    setTrack: (state, track: AudioTrack) => (state.currentTrack = track)
}

export const actions: ActionTree<RootState, RootState> = {
}
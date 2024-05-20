import { defineAsyncComponent, type Component } from 'vue'
import MainView from '@/components/home/sections/MainView.vue'

export const DEFAULT_SHOW_TITLE = true,
  DEFAULT_FULLSCREEN = true

export type SectionData = {
  title: string
  showTitle?: boolean

  component: Component
  fullscreen?: boolean
}

export type SectionList = {
  [id: string]: SectionData
}

export const sections = {
  'main-view': {
    title: '메인 화면',
    showTitle: false,

    component: MainView,
    fullscreen: false,
  },
  'size-settings': {
    title: '행과 열 설정',
    component: defineAsyncComponent(() => import('@/components/home/sections/SizeSettings.vue')),
  },
  'random-pick-seat': {
    title: '무작위 자리 뽑기',
    component: defineAsyncComponent(() => import('@/components/home/sections/RandomPickSeat.vue')),
  },
} as const

sections satisfies SectionList

export type SectionId = keyof typeof sections

export const defaultSectionId: SectionId = 'main-view'

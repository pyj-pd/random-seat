import { defineAsyncComponent, type Component } from 'vue'
import MainView from '@/components/picker/sections/MainView.vue'
import LoadingSection from '@/components/picker/sections/LoadingSection.vue'

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
    component: defineAsyncComponent({
      /** @todo use Suspense instead of repeating the same code */
      loader: () => import('@/components/picker/sections/SizeSettings.vue'),
      loadingComponent: LoadingSection,
    }),
  },
  'random-pick-seat': {
    title: '무작위 자리 뽑기',
    component: defineAsyncComponent({
      loader: () => import('@/components/picker/sections/RandomPickSeat.vue'),
      loadingComponent: LoadingSection,
    }),
  },
} as const satisfies SectionList

export type SectionId = keyof typeof sections

export const defaultSectionId: SectionId = 'main-view'

import { defineAsyncComponent, type Component } from 'vue'
import MainView from '@/components/picker/sections/MainView.vue'
import LoadingSection from '@/components/picker/sections/LoadingSection.vue'
import type { RouteName } from '@/router'

export const DEFAULT_SHOW_TITLE = true,
  DEFAULT_FULLSCREEN = true

export type PickerType = Extract<RouteName, 'home' | 'ticketing' | 'ticketing-client'>

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
    title: '행과 열 설정하기',
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

  // Ticketing
  'wait-for-clients': {
    title: '사용자 접속시키기',
    component: defineAsyncComponent({
      loader: () => import('@/components/picker/sections/ticketing/WaitForClients.vue'),
      loadingComponent: LoadingSection,
    }),
  },

  // Ticketing clients
  'wait-for-start': {
    title: '티케팅 참여하기',
    component: defineAsyncComponent({
      loader: () => import('@/components/picker/sections/ticketing/client/WaitForStart.vue'),
      loadingComponent: LoadingSection,
      suspensible: false,
    }),
  },
} as const satisfies SectionList

export type SectionId = keyof typeof sections

export const defaultSectionId: SectionId = 'main-view',
  /** For clients who are joining ticketing */
  defaultClientSectionId: SectionId = 'wait-for-start'

import { defineAsyncComponent, type Component } from 'vue'
import LoadingSection from '@/components/picker/sections/LoadingSection.vue'
import type { RouteName } from '@/router'

export const DEFAULT_SHOW_TITLE = true,
  DEFAULT_FULLSCREEN = true

export type PickerType = Extract<RouteName, 'home'>

export type SectionData = {
  title: string
  showTitle?: boolean

  component: Component
}

export type SectionList = {
  [id: string]: SectionData
}

/**
 * Section list.
 *
 * **The order of sections matter!** It will be used on navigation bar back button.
 */
export const sections = {
  'size-settings': {
    title: '행과 열 설정하기',
    component: defineAsyncComponent({
      /** @todo use Suspense instead of repeating the same code */
      loader: () => import('@/components/picker/sections/SizeSettings.vue'),
      loadingComponent: LoadingSection,
    }),
  },
  'name-settings': {
    title: '이름 설정하기',
    component: defineAsyncComponent({
      /** @todo use Suspense instead of repeating the same code */
      loader: () => import('@/components/picker/sections/NameSettings.vue'),
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

export const sectionIds = Object.keys(sections) as SectionId[]

export const defaultSectionId: SectionId = 'size-settings',
  defaultRouteHash: string = ''

export const ROUTE_HASH_PREFIX = '#' as const

import { type RouteRecordRaw } from 'vue-router'
import PickerView from '../views/PickerView.vue'
import { MAX_SEAT_COLUMN_SIZE, MAX_SEAT_ROW_SIZE } from '@/constants/seat'
import NotFoundView from '@/views/NotFoundView.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: PickerView,
  },

  // Other
  {
    path: '/:pathMatch(.*)*',
    name: '404-not-found',
    component: NotFoundView,
  },
] as const satisfies RouteRecordRaw[]

export type RouteName = (typeof routes)[number]['name']
export type PickerRouteName = Extract<RouteName, 'home'>

export type RouteMetadata = {
  name: RouteName
  title: string
  description?: string
  visibleToSearchEngines: boolean
}

export const routeMetadata = [
  {
    name: 'home',
    title: '무작위 자리 뽑기 — 편리하고 공정한 자리 배치',
    description: `최대 ${MAX_SEAT_COLUMN_SIZE}×${MAX_SEAT_ROW_SIZE} 크기의 자리 배치를 랜덤하게 바꾸어 보세요. TV에 연결하여 같이 보면 더욱 좋습니다. 직관적인 UI와 깔끔한 디자인을 갖추고 있습니다.`,
    visibleToSearchEngines: true,
  },

  {
    name: '404-not-found',
    title: '404 Not Found',
    visibleToSearchEngines: false,
  },
] as const satisfies RouteMetadata[]

/** @todo add support for dynamic metadata */
export const defaultMetadata = routeMetadata.find((value) => value.name === 'home') as RouteMetadata

// Validation

/**
 * Checks if all routes have its matching metadata.
 */
export const _validateRouteMetadata = () => {
  const allNames = routeMetadata.reduce<string[]>((prev, curr) => [...prev, curr.name], [])

  const areEveryRoutesIncluded = routes.every((route) => allNames.includes(route.name))

  if (!areEveryRoutesIncluded) throw new Error('Route metadata missing some route names.')
}

_validateRouteMetadata()

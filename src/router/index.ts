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

  // Ticketing
  {
    path: '/ticketing',
    name: 'ticketing',
    component: PickerView,
  },
  {
    path: '/ticketing/:id',
    name: 'ticketing-client',
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
export type PickerRouteName = Extract<RouteName, 'home' | 'ticketing' | 'ticketing-client'>

export type RouteMetadata = {
  name: RouteName
  title: string
  description?: string
  visibleToSearchEngines: boolean
}

export const routeMetadata = [
  {
    name: 'home',
    title: '무작위 자리 뽑기',
    description: `최대 ${MAX_SEAT_COLUMN_SIZE}×${MAX_SEAT_ROW_SIZE} 크기의 자리를 무작위로 배치해 보세요. 직관적인 UI와 깔끔한 디자인을 갖추고 있습니다.`,
    visibleToSearchEngines: true,
  },

  {
    name: 'ticketing',
    title: '티케팅 자리 뽑기',
    description: `최대 ${MAX_SEAT_COLUMN_SIZE}×${MAX_SEAT_ROW_SIZE} 크기의 자리를 구성원 각자의 기기로 티케팅을 통해 뽑을 수 있습니다. 학교 등에서 재미있게 자리를 뽑아보세요.`,
    visibleToSearchEngines: true,
  },
  {
    name: 'ticketing-client',
    title: '티케팅 자리 뽑기에 연결하기',
    description: '주최자에게 해당 링크를 받았나요? 연결하여 자리 뽑기에 참여해 보세요!',
    visibleToSearchEngines: false,
  },

  {
    name: '404-not-found',
    title: '404 Not Found',
    visibleToSearchEngines: false,
  },
] as const satisfies RouteMetadata[]

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

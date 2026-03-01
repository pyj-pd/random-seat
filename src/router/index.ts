import { type RouteRecordRaw } from 'vue-router'
import PickerView from '../views/PickerView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { SITE_DESCRIPTION, SITE_TITLE } from '@/constants/project'

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
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    visibleToSearchEngines: true,
  },
  {
    name: '404-not-found',
    title: '404 Not Found',
    visibleToSearchEngines: false,
  },
] as const satisfies RouteMetadata[]

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

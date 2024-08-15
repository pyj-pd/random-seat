import { routeMetadata, type RouteMetadata, type RouteName } from '@/router'

export const getRouteMetadata = (routeName: RouteName): RouteMetadata =>
  routeMetadata.find((item) => item.name === routeName) as RouteMetadata

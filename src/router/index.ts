import { type RouteRecordName, type RouteRecordRaw } from 'vue-router'
import DefaultView from '../views/DefaultView.vue'
import TicketingView from '@/views/TicketingView.vue'
import { MAX_SEAT_COLUMN_SIZE, MAX_SEAT_ROW_SIZE } from '@/constants/seat'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: DefaultView,
  },
  {
    path: '/ticketing',
    name: 'ticketing',
    component: TicketingView,
  },
] as const satisfies RouteRecordRaw[]

export type RouteMetadata<RouteName extends RouteRecordName> = {
  name: RouteName
  title: string
  description: string
}

export const routeMetadata = [
  {
    name: 'home',
    title: '무작위 자리 뽑기',
    description: `최대 ${MAX_SEAT_COLUMN_SIZE}×${MAX_SEAT_ROW_SIZE} 크기의 자리를 무작위로 배치해 보세요. 직관적인 UI와 깔끔한 디자인을 갖추고 있습니다.`,
  },
  {
    name: 'ticketing',
    title: '티케팅 자리 뽑기',
    description: `최대 ${MAX_SEAT_COLUMN_SIZE}×${MAX_SEAT_ROW_SIZE} 크기의 자리를 구성원 각자의 기기로 티케팅을 통해 뽑을 수 있습니다. 학교 등에서 재미있게 자리를 뽑아보세요.`,
  },
] as const satisfies RouteMetadata<(typeof routes)[number]['name']>[]

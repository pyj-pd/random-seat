// Make sure to change `base` in `vite.config.ts` too!

import { MAX_SEAT_COLUMN_SIZE, MAX_SEAT_ROW_SIZE } from './seat'

export const GITHUB_REPO_URL = 'https://github.com/pyj-pd/random-seat'
export const BLOG_URL = 'https://pyj-pd.dev/'

export const PARENT_SITE_NAME = 'pyj-pd'

export const SITE_NAME = '무작위 자리 뽑기',
  SITE_SLOGAN = '깔끔하고 편리하게 자리 배치',
  SITE_URL = 'https://pyj-pd.dev/random-seat/'

// For metadata
export const SITE_TITLE = `${SITE_NAME} — ${SITE_SLOGAN}`
export const SITE_DESCRIPTION = `최대 ${MAX_SEAT_COLUMN_SIZE}×${MAX_SEAT_ROW_SIZE} 크기의 자리 배치를 랜덤하게 바꾸어 보세요. 무작위로 자리를 간편하고 공평하게 뽑을 수 있습니다.`

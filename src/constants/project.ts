// Make sure to change `base` in `vite.config.ts` too!

import { MAX_SEAT_COLUMN_SIZE, MAX_SEAT_ROW_SIZE } from './seat'

export const GITHUB_REPO_URL = 'https://github.com/pyj-pd/random-seat'
export const LICENSE_TEXT = 'AGPL-3.0'

export const BLOG_URL = 'https://pyj-pd.dev/'

export const PARENT_SITE_NAME = 'pyj-pd'

export const SITE_NAME = '무작위 자리 뽑기',
  SITE_SLOGAN = '편리하게 자리 배치 & PDF 저장',
  SITE_URL = 'https://pyj-pd.dev/random-seat/'

// For metadata
export const SITE_TITLE = `${SITE_NAME} — ${SITE_SLOGAN}`
export const SITE_DESCRIPTION = `최대 ${MAX_SEAT_COLUMN_SIZE}×${MAX_SEAT_ROW_SIZE} 크기의 랜덤 자리 뽑기! 클릭 한 번으로 공평하게 뽑고, 배치한 자리는 바로 PDF로 저장하여 인쇄 및 공유할 수 있습니다.`

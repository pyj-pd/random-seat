import { PROJECT_PAGE_URL } from '@/constants/project'

/**
 * Clients will join through this URL when host opens and starts hosting.
 * @example http://seat.example.com/ticketing/insert-id-here
 */
const PEER_CLIENT_CONNECTION_URL = PROJECT_PAGE_URL + '/ticketing/'

export const getPeerClientConnectionUrl = (hostPeerId: string): string =>
  PEER_CLIENT_CONNECTION_URL + hostPeerId

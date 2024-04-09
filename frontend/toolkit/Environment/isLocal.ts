import { getEnvironment } from './getEnvironment'

export const isLocal = (): boolean => getEnvironment() === 'local'

import { getEnvironment } from './getEnvironment'

export const isDevelopment = (): boolean => getEnvironment() === 'development'

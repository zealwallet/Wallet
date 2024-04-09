import { getEnvironment } from './getEnvironment'

export const isProduction = (): boolean => getEnvironment() === 'production'

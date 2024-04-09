import React from 'react'
import { SvgUri } from 'react-native-svg'

type Props = {
    size?: number | '100%'
    src: string
}

export const SvgImage = ({ size = '100%', src }: Props) => {
    return <SvgUri width={size} height={size} uri={src} />
}

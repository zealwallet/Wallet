import React from 'react'

type Props = {
    size?: number | '100%'
    src: string
}

export const SvgImage = ({ src, size = '100%' }: Props) => {
    return <img width={size} height={size} alt="" src={src} />
}

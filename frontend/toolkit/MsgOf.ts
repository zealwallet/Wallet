import React, { ElementType } from 'react'

export type MsgOf<T extends ElementType> =
    React.ComponentPropsWithoutRef<T>['onMsg'] extends (msg: infer M) => void
        ? M
        : never

import React, { useEffect, useRef, useState } from 'react'

import { colors } from '@zeal/uikit/colors'

import { notReachable, useLiveRef } from '@zeal/toolkit'

import styles from './index.module.scss'

export type ClassName = keyof typeof styles

type Props = {
    children: React.ReactNode
    onMsg: (msg: Msg) => void
}

const DragHandle = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div
            className={styles.DragHandle}
            style={{ backgroundColor: colors['backgroundLight'] }}
        >
            {children}
        </div>
    )
}

export type Msg =
    | { type: 'drag'; movement: { x: number; y: number } }
    | { type: 'on_click' }

export const DragAndClickHandler = ({ children, onMsg }: Props) => {
    const [start, setStart] = useState<boolean>(false)
    const drag = useRef(false)
    const liveMsg = useLiveRef(onMsg)
    useEffect(() => {
        if (start) {
            const mouseMove = (e: MouseEvent) => {
                drag.current = true
                liveMsg.current({
                    type: 'drag',
                    movement: { x: e.movementX, y: e.movementY },
                })
            }

            const mouseUp = () => {
                if (!drag.current) {
                    liveMsg.current({ type: 'on_click' })
                }
                setStart(false)
                drag.current = false
                window.removeEventListener('mouseup', mouseUp)
                window.removeEventListener('mousemove', mouseMove)
            }

            window.addEventListener('mousemove', mouseMove)
            window.addEventListener('mouseup', mouseUp)
        }
    }, [liveMsg, start])

    return (
        <div
            className={styles.Base}
            onMouseDown={() => {
                setStart(true)
            }}
        >
            {children}
        </div>
    )
}

type BarMsg = Extract<Msg, { type: 'drag' }>

export const DragAndDropBar = ({ onMsg }: { onMsg: (msg: BarMsg) => void }) => {
    return (
        <DragAndClickHandler
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'on_click':
                        // we cannot click drag bar so just ignor
                        break
                    case 'drag':
                        onMsg(msg)
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(msg)
                }
            }}
        >
            <DragHandle />
        </DragAndClickHandler>
    )
}

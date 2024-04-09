import React from 'react'
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'

type Args = {
    value: string
    onChange: (str: string) => void
    format: (str: string) => string
    mask?: boolean
    replace?: (str: string) => string
    append?: (str: string) => string
    accept?: RegExp
}

export type RenderProps = {
    value: string
    onChange: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void
}

type Props = Args & {
    children: (props: RenderProps) => React.ReactNode
}

export const useRifm = (props: Args): RenderProps => {
    const valueRef = React.useRef<string | null>(null)
    const { replace } = props
    const userValue = replace
        ? replace(props.format(props.value))
        : props.format(props.value)

    const onChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const eventValue = e.nativeEvent.text
        const formattedValue = props.format(eventValue)
        const replacedValue = replace ? replace(formattedValue) : formattedValue

        if (userValue === replacedValue) {
            return
        }
        props.onChange(replacedValue)
    }

    return {
        value: valueRef.current != null ? valueRef.current : userValue,
        onChange,
    }
}
export const Rifm = (props: Props) => {
    const renderProps = useRifm(props as any)

    return <>{props.children(renderProps)}</>
}

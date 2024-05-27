import React from 'react'
import { ScrollView } from 'react-native'

type Props = {
    children: React.ReactNode
}
export const Content = ({ children }: Props) => (
    <ScrollView
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
    >
        {children}
    </ScrollView>
)

import React, { useState } from 'react'

import { Column } from '@zeal/uikit/Column'
import { FloatInput } from '@zeal/uikit/Input/FloatInput'

import { noop } from '@zeal/toolkit'

import { Input } from './index'

export const TextTest = () => {
    const [customRifmFloat, setCustomRifFloatValue] = useState<string>('')

    return (
        <Column spacing={12}>
            <FloatInput
                value={customRifmFloat}
                prefix="$"
                fraction={3}
                onChange={(value) => setCustomRifFloatValue(value || '')}
            >
                {({ value, onChange }) => (
                    <Input
                        keyboardType="numeric"
                        state="normal"
                        variant="small"
                        onSubmitEditing={noop}
                        type="text"
                        placeholder="rifm float"
                        onChange={onChange}
                        value={value}
                    />
                )}
            </FloatInput>
        </Column>
    )
}

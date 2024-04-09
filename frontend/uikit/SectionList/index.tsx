import React, { ReactElement } from 'react'
import {
    SectionList as NativeSectionList,
    SectionListData,
    StyleSheet,
    View,
} from 'react-native'
import { SectionListRenderItem } from 'react-native/Libraries/Lists/SectionList'

import { notReachable } from '@zeal/toolkit'

import { styles as groupStyles } from '../Group'

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    group_item: {
        paddingHorizontal: groupStyles.variant_default.padding,
        backgroundColor: groupStyles.group.backgroundColor,
    },
    group_start: {
        paddingTop: groupStyles.variant_default.padding,
        borderTopLeftRadius: groupStyles.group.borderRadius,
        borderTopRightRadius: groupStyles.group.borderRadius,
    },
    group_end: {
        paddingBottom: groupStyles.variant_default.padding,
        borderBottomLeftRadius: groupStyles.group.borderRadius,
        borderBottomRightRadius: groupStyles.group.borderRadius,
    },
    item_separator_default: {
        backgroundColor: 'transparent',
    },
    item_separator_grouped: {
        backgroundColor: groupStyles.group.backgroundColor,
    },
})

type Variant = 'default' | 'grouped'

type Spacing = 8 | 12

type Props<I, S> = {
    variant: Variant
    itemSpacing: Spacing
    sectionSpacing: Spacing
    sections: SectionListData<I, S>[]
    emptyState?: ReactElement
    footer?: ReactElement | null
    renderSectionHeader?: (info: {
        section: SectionListData<I, S>
    }) => ReactElement
    renderItem: SectionListRenderItem<I, S>
    onEndReached?: (info: { distanceFromEnd: number }) => void
}

const ON_END_REACHED_THRESHOLD = 2 // How far from the end (in units of visible length of the list) the bottom edge of the list must be from the end of the content to trigger the onEndReached callback

export const SectionList = function <I, S>({
    sections,
    variant,
    itemSpacing,
    sectionSpacing,
    emptyState,
    renderSectionHeader,
    renderItem,
    onEndReached,
    footer,
}: Props<I, S>) {
    return (
        <NativeSectionList
            stickySectionHeadersEnabled={false}
            style={styles.list}
            sections={sections}
            renderSectionHeader={renderSectionHeader}
            renderItem={(itemRenderProps) => {
                switch (variant) {
                    case 'default':
                        return renderItem(itemRenderProps)
                    case 'grouped': {
                        const { index, section } = itemRenderProps
                        return (
                            <View
                                style={[
                                    styles.group_item,
                                    index === 0 && styles.group_start,
                                    index === section.data.length - 1 &&
                                        styles.group_end,
                                ]}
                            >
                                {renderItem(itemRenderProps)}
                            </View>
                        )
                    }
                    /* istanbul ignore next */
                    default:
                        return notReachable(variant)
                }
            }}
            onEndReached={onEndReached}
            onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
            ItemSeparatorComponent={() => (
                <ItemSeparator spacing={itemSpacing} variant={variant} />
            )}
            SectionSeparatorComponent={() => (
                <SectionSeparator spacing={sectionSpacing} />
            )}
            ListEmptyComponent={emptyState}
            ListFooterComponent={footer}
            showsVerticalScrollIndicator={false}
        />
    )
}

const ItemSeparator = ({
    spacing,
    variant,
}: {
    spacing: number
    variant: Variant
}) => (
    <View style={[{ height: spacing }, styles[`item_separator_${variant}`]]} />
)

const SectionSeparator = ({ spacing }: { spacing: number }) => (
    <View style={{ height: spacing }} />
)

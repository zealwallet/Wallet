import React from 'react'
import { FormattedMessage } from 'react-intl'

import { BoldBrowseGlobe } from '@zeal/uikit/Icon/BoldBrowseGlobe'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { ListItem } from '@zeal/uikit/ListItem'

type Props = {
    onClick: () => void
}

export const DiscoverMoreAppsListItem = ({ onClick }: Props) => {
    return (
        <ListItem
            aria-current={false}
            size="large"
            onClick={onClick}
            avatar={({ size }) => (
                <BoldBrowseGlobe size={size} color="iconDefault" />
            )}
            primaryText={
                <FormattedMessage
                    id="browse.discover_more_apps"
                    defaultMessage="Discover more Apps"
                />
            }
            side={{
                rightIcon: ({ size }) => (
                    <ExternalLink size={size} color="iconDefault" />
                ),
            }}
        />
    )
}

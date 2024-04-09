import { ImageBackground } from 'react-native'

import { Avatar as UIAvatar } from '@zeal/uikit/Avatar'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem as UIListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { openExternalURL } from '@zeal/toolkit/Window'

import { format } from '@zeal/domains/Address/helpers/format'
import { NetworkMap } from '@zeal/domains/Network'
import {
    SignMessageSafetyCheck,
    TransactionSafetyCheck,
} from '@zeal/domains/SafetyCheck'
import { SmartContractBadge } from '@zeal/domains/SafetyCheck/components/SmartContractBadge'
import { SmartContract } from '@zeal/domains/SmartContract'
import { getExplorerLink } from '@zeal/domains/SmartContract/helpers/getExplorerLink'

type Props = {
    smartContract: SmartContract
    networkMap: NetworkMap
    safetyChecks: Array<TransactionSafetyCheck | SignMessageSafetyCheck> | null
}

export const ListItem = ({
    smartContract,
    networkMap,
    safetyChecks,
}: Props) => {
    const label = smartContract.name || smartContract.website || null

    const explorerLink = getExplorerLink(smartContract, networkMap)

    return (
        <UIListItem
            aria-current={false}
            size="large"
            avatar={({ size }) =>
                smartContract.logo ? (
                    <UIAvatar
                        size={size}
                        rightBadge={({ size }) =>
                            safetyChecks ? (
                                <SmartContractBadge
                                    size={size}
                                    safetyChecks={safetyChecks}
                                />
                            ) : null
                        }
                    >
                        <ImageBackground
                            style={[{ width: '100%', height: '100%' }]}
                            source={{ uri: smartContract.logo }}
                        />
                    </UIAvatar>
                ) : (
                    <UIAvatar
                        size={size}
                        rightBadge={({ size }) =>
                            safetyChecks ? (
                                <SmartContractBadge
                                    size={size}
                                    safetyChecks={safetyChecks}
                                />
                            ) : null
                        }
                    >
                        <QuestionCircle color="iconDefault" size={size} />
                    </UIAvatar>
                )
            }
            primaryText={
                <Row spacing={4}>
                    <Text
                        ellipsis
                        id={`smart-contract-label-${smartContract.address}`}
                        variant="callout"
                        weight="regular"
                        color="textPrimary"
                    >
                        {label || format(smartContract.address)}
                    </Text>
                    {!label && !!explorerLink && (
                        <IconButton
                            variant="on_light"
                            onClick={() => openExternalURL(explorerLink)}
                        >
                            {({ color }) => (
                                <ExternalLink size={14} color={color} />
                            )}
                        </IconButton>
                    )}
                </Row>
            }
            shortText={
                label ? (
                    <Row spacing={4}>
                        <Text
                            id={`smart-contract-desc-${smartContract.address}`}
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            {format(smartContract.address)}
                        </Text>

                        {!explorerLink ? null : (
                            <IconButton
                                variant="on_light"
                                onClick={() => openExternalURL(explorerLink)}
                            >
                                {({ color }) => (
                                    <ExternalLink size={14} color={color} />
                                )}
                            </IconButton>
                        )}
                    </Row>
                ) : null
            }
        />
    )
}

import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Row } from '@zeal/uikit/Row'
import { Skeleton as UISkeleton } from '@zeal/uikit/Skeleton'

export const Skeleton = () => {
    return (
        <Group variant="default">
            <Column spacing={8}>
                <Row spacing={0} alignX="stretch">
                    <UISkeleton variant="default" height={19} width={60} />
                    <UISkeleton variant="default" height={19} width={30} />
                </Row>

                <Row spacing={0} alignX="stretch">
                    <UISkeleton variant="default" height={19} width={60} />
                    <UISkeleton variant="default" height={19} width={70} />
                </Row>

                <UISkeleton variant="default" width={30} height={4} />
            </Column>
        </Group>
    )
}

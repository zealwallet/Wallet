import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Skeleton as UISkeleton } from '@zeal/uikit/Skeleton'

export const Skeleton = () => (
    <Column spacing={4}>
        <UISkeleton variant="default" height={35} width={75} />

        <Row spacing={12}>
            <UISkeleton variant="default" height={18} width={120} />

            <UISkeleton variant="default" height={18} width={35} />
        </Row>
    </Column>
)

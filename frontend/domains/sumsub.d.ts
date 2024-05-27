declare module '@sumsub/react-native-mobilesdk-module' {
    type SumSubStatus =
        | 'Ready'
        | 'Failed'
        | 'Initial'
        | 'Incomplete'
        | 'Pending'
        | 'TemporarilyDeclined'
        | 'FinallyRejected'
        | 'Approved'
        | 'ActionCompleted'

    type SumSubStatusChangeEvent = {
        prevStatus: SumSubStatus
        newStatus: SumSubStatus
    }

    type SumSubMobileSDK = {
        init: (
            accessToken: string,
            refreshHandler: () => string
        ) => SumSubMobileSDK
        withHandlers: (handlers: {
            onStatusChanged?: (event: SumSubStatusChangeEvent) => void
        }) => SumSubMobileSDK
        build: () => SumSubMobileSDK
        launch: () => void
        dismiss: () => void
    }

    const sdk: SumSubMobileSDK
    export default sdk
}

import { ChromeRuntimeMessageRequest } from '..'

type SendToZwidgetResult =
    | { type: 'zwidget_not_active' }
    | { type: 'message_sent_to_zwidget'; response: unknown }

export const sendToActiveTabZWidget = async (
    msg: ChromeRuntimeMessageRequest
): Promise<SendToZwidgetResult> => {
    try {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        })

        if (tab && tab.id) {
            const response = await chrome.tabs.sendMessage(tab.id, msg)
            return { type: 'message_sent_to_zwidget', response }
        }

        return { type: 'zwidget_not_active' }
    } catch (e) {
        return { type: 'zwidget_not_active' }
    }
}

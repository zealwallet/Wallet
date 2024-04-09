const mountIframe = () => {
    const iframe = document.createElement('iframe')
    iframe.allow = 'hid'
    iframe.src = '/index.html' + window.location.search
    document.body.appendChild(iframe)
}

const fetchIsPinned = () =>
    window.chrome.action
        .getUserSettings()
        .then((settings) => settings.isOnToolbar)

const fireConfetti = () => {
    try {
        window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.4 },
        })
    } catch (error) {}
}

const pinCheckLoop = async () => {
    const RETRY_TIME_MS = 200

    const timeoutFunction = async () => {
        let result = null
        try {
            result = await fetchIsPinned()
        } catch {}

        if (!result) {
            setTimeout(timeoutFunction, RETRY_TIME_MS)
        } else {
            fireConfetti()
            document.querySelector('.pin-widget').classList.add('hidden')
        }
    }

    let initiallyPinned = true

    try {
        initiallyPinned = await fetchIsPinned()
    } catch (error) {}

    if (!initiallyPinned) {
        document.querySelector('.pin-widget').classList.remove('hidden')
        setTimeout(timeoutFunction, RETRY_TIME_MS)
    }
}

const params = new URLSearchParams(window.location.search)

mountIframe()

if (params.get('type') === 'extension') {
    pinCheckLoop()
}

if (params.get('celebrate')) {
    setTimeout(() => {
        fireConfetti()
    }, 500)
}

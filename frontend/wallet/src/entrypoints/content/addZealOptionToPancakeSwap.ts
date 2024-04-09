export const addZealOptionToPancakeSwap = (
    _: MutationRecord[],
    portalObserver: MutationObserver
) => {
    const portal = document.getElementById('portal-root')

    if (portal) {
        const modalObserver = new MutationObserver(() => {
            const elements = portal.querySelectorAll('div, h1')
            elements.forEach((element) => {
                if (
                    element.firstChild?.nodeType === Node.TEXT_NODE &&
                    element.innerHTML.toLowerCase().includes('injected')
                ) {
                    element.innerHTML = element.innerHTML.replace(
                        /injected/gi,
                        'Zeal'
                    )

                    // replace icon
                    if (
                        element.previousSibling &&
                        element.previousSibling.firstChild &&
                        element.previousSibling.firstChild instanceof
                            HTMLDivElement &&
                        element.previousSibling.firstChild.innerHTML.includes(
                            'svg'
                        )
                    ) {
                        element.previousSibling.firstChild.appendChild(
                            createZealLogoSvg()
                        )

                        const oldIcon =
                            element.previousSibling.firstChild.firstChild

                        if (oldIcon && oldIcon instanceof SVGElement) {
                            oldIcon.style.display = 'none' // we cannot replace the old icon since dApp crashes when they try and remove the node
                        }
                    }
                }
            })
        })

        modalObserver.observe(portal, {
            childList: true,
            subtree: true,
        })
        portalObserver.disconnect()
    }
}

const createZealLogoSvg = () => {
    const namespace = 'http://www.w3.org/2000/svg'

    const svg = document.createElementNS(namespace, 'svg')
    svg.setAttribute('xmlns', namespace)
    svg.setAttribute('fill', 'none')
    svg.setAttribute('viewBox', '0 0 28 28')

    const path1 = document.createElementNS(namespace, 'path')
    path1.setAttribute('fill', '#0FF')
    path1.setAttribute('d', 'M0 0h28v28H0z')

    const path2 = document.createElementNS(namespace, 'path')
    path2.setAttribute('fill', '#0B1821')
    path2.setAttribute(
        'd',
        'M6.51 21.49h14.98v-6.74H9.506a2.996 2.996 0 0 0-2.996 2.995v3.745ZM21.49 6.51H6.51v6.741h11.984a2.996 2.996 0 0 0 2.996-2.996V6.51Z'
    )

    svg.appendChild(path1)
    svg.appendChild(path2)

    return svg
}

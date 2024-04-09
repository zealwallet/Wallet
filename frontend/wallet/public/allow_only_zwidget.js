const params = Object.fromEntries(
    new URLSearchParams(window.location.search).entries()
)
if (params.type !== 'zwidget') {
    document.getElementById('root')?.remove()
}

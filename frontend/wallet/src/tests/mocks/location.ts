const origLocation = window.location

const mockLocation = {
    replace: jest.fn(),
}

Object.defineProperty(mockLocation, 'search', {
    get: () => origLocation.search,
})

export const clearLocationMock = () => {
    Object.defineProperty(window, 'location', { value: origLocation })
}

export const getLocationMock = () => {
    Object.defineProperty(window, 'location', { value: mockLocation })
    return mockLocation
}

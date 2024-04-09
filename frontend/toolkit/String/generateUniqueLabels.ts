export const generateUniqueLabels = (
    existingLabels: string[],
    prefix: string,
    count: number
): string[] => {
    const newLabels: string[] = new Array(count).fill('')
    let maxNum = 0

    // Find the maximum number suffix among existing labels with the given prefix
    existingLabels.forEach((label) => {
        if (label.startsWith(prefix)) {
            const [, suffix] = label.split(`${prefix} `)
            const num = parseInt(suffix)
            if (!isNaN(num) && num > maxNum) {
                maxNum = num
            }
        }
    })

    return newLabels.map((_, index) => `${prefix} ${maxNum + index + 1}`)
}

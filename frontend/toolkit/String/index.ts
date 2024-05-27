export const chunk = (str: string, count: number): string[] => {
    const chunks: string[] = []
    const chunkCount = Math.ceil(str.length / count)

    for (let i = 0; i < chunkCount; i++) {
        const chunk = str.substring(i * count, (i + 1) * count)
        chunks.push(chunk)
    }

    return chunks
}

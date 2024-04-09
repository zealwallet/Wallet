import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as prettier from 'prettier'

const url = 'https://chainid.network/chains.json'

const outputPath = path.join(
    __dirname,
    '..',
    'src',
    'domains',
    'Network',
    'chains.ts'
)

const iconFolder = path.join(__dirname, '..', 'public', 'chain-icons')

const iconFileExists = (icon: string) =>
    fs.existsSync(path.join(iconFolder, `${icon}.png`))

const chainType = (item: any) => {
    const testnet =
        item.name?.toLowerCase().includes('test') ||
        item.title?.toLowerCase().includes('test') ||
        item.network?.toLowerCase().includes('test')

    const devnet =
        item.name?.toLowerCase().includes('devnet') ||
        item.title?.toLowerCase().includes('devnet') ||
        item.network?.toLowerCase().includes('devnet')

    return !testnet && !devnet ? 'mainnet' : 'testnet'
}

https
    .get(url, (response) => {
        let data = ''

        response.on('data', (chunk) => {
            data += chunk
        })

        response.on('end', () => {
            if (response.statusCode === 200) {
                try {
                    const parsedData = JSON.parse(data)

                    const mappedData = parsedData.map((data: any) => {
                        const {
                            name,
                            chain: chainName,
                            icon,
                            chainId,
                            networkId,
                        } = data

                        return {
                            type: chainType(data),
                            name,
                            chainName,
                            hexChainId: `0x${chainId.toString(16)}`,
                            networkId,
                            icon: icon && iconFileExists(icon) ? icon : null,
                        }
                    })

                    const formattedData = JSON.stringify(mappedData, null, 4)

                    fs.writeFileSync(
                        outputPath,

                        prettier.format(
                            `export type KnownNetwork = {
                                type: 'mainnet' | 'testnet',
                                name: string,
                                chainName: string,
                                hexChainId: string,
                                networkId: number,
                                icon: string | null,
                            }
                            
                            export const KNOWN_NETWORKS: KnownNetwork[] = ${formattedData}`,
                            JSON.parse(
                                fs.readFileSync(
                                    path.join(
                                        __dirname,
                                        '..',
                                        '..',
                                        '.prettierrc'
                                    ),
                                    'utf8'
                                )
                            )
                        )
                    )
                    console.log(`Saved to ${outputPath}`) // eslint-disable-line no-console
                } catch (err) {
                    console.error('Error parsing JSON:', err) // eslint-disable-line no-console
                }
            } else {
                // eslint-disable-next-line no-console
                console.error(
                    `Failed to fetch from the URL. Status: ${response.statusCode}`
                )
            }
        })
    })
    .on('error', (err) => {
        console.error('Error:', err) // eslint-disable-line no-console
    })

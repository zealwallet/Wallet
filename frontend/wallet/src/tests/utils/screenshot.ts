import { promises as fs } from 'fs'
import { configureToMatchImageSnapshot } from 'jest-image-snapshot'
import os from 'os'
import path from 'path'
import puppeteer, { Browser } from 'puppeteer'

expect.extend({
    toMatchImageSnapshot: configureToMatchImageSnapshot({
        customDiffConfig: { threshold: 0.2 },
        blur: 1,
    }),
})

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

const createGlobalPuppeteerBrowser = async () => {
    const browser = await puppeteer.launch({
        args: [
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--enable-font-antialiasing',
            '--no-sandbox',
        ],
    })

    // Create temp directy and save our file with the WebSocket address.
    await fs.mkdir(DIR, { recursive: true })
    await fs.writeFile(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())

    return browser
}

let browser: Browser

beforeAll(async () => {
    browser = await createGlobalPuppeteerBrowser()
})

afterAll(async () => {
    await fs.rm(DIR, { recursive: true, force: true })
    await browser.close()
})

export const takeScreenshot = async () => {
    const page = await browser.newPage()

    await page.setViewport({
        width: 320,
        height: 600,
    })

    await page.setContent(document.documentElement.outerHTML)

    const screenshot = await page.screenshot()

    await page.close()

    return screenshot
}

import * as child_process from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const argPath = process.argv[2]

if (!argPath) {
    console.error('FAILED! Please pass path to build dir as a parameter') // eslint-disable-line no-console
    process.exit(-1)
}

const BUILD_JS_DIR = path.join(process.cwd(), argPath)

const { SENTRY_ORG, SENTRY_PROJECT } = process.env

if (!SENTRY_ORG || !SENTRY_PROJECT) {
    // eslint-disable-next-line no-console
    console.error(
        'FAILED! Please make sure that SENTRY_ORG and SENTRY_PROJECT env variables are set'
    )
    process.exit(-1)
}

const filesToUpload = fs
    .readdirSync(BUILD_JS_DIR)
    .filter((file) => file.match(/\.(js|js\.map)$/gim))
    .map((file) => path.join(BUILD_JS_DIR, file))

if (!filesToUpload.length) {
    console.error('No files to inject found') // eslint-disable-line no-console
    process.exit(-1)
}

const injectCmd = `yarn sentry-cli sourcemaps inject ${BUILD_JS_DIR}`

const injectOutput = child_process.execSync(injectCmd)
console.log(injectOutput.toString()) // eslint-disable-line no-console

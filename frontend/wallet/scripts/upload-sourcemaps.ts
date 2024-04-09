import * as child_process from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const argPath = process.argv[2]

if (!argPath) {
    console.error('FAILED! Please pass path to build dir as a parameter') // eslint-disable-line no-console
    process.exit(-1)
}

const BUILD_JS_DIR = path.join(__dirname, argPath)
const MANIFEST_PATH = path.join(__dirname, argPath, './manifest.json')

console.log(`Path for sourcemaps lookup: ${BUILD_JS_DIR}`) // eslint-disable-line no-console

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

const manifest = require(MANIFEST_PATH) // eslint-disable-line @typescript-eslint/no-var-requires

if (!filesToUpload.length) {
    console.error('No files to upload found') // eslint-disable-line no-console
    process.exit(-1)
}

const uploadCmd = `yarn sentry-cli sourcemaps upload \
    --org ${SENTRY_ORG} \
    --project ${SENTRY_PROJECT} \
    --release ${manifest.version} \
    ${filesToUpload.join(' ')}`

const uploadOoutput = child_process.execSync(uploadCmd)
console.log(uploadOoutput.toString()) // eslint-disable-line no-console

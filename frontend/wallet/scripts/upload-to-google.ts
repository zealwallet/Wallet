import { google } from 'googleapis'
import * as fs from 'fs'
import * as path from 'path'

const credentials = JSON.parse(process.env['GOOGLE_ACCOUNT_CRED']!)
const token = JSON.parse(process.env['GOOGLE_ACCOUNT_REFRESH_TOKEN']!)

const ROOT_PATH = path.join(__dirname, '..')

const DRIVE_FOLDER_ID = process.env['GOOGLE_DRIVE_FOLDER_ID']!

const PARALLEL_UPLOADS_COUNT = 25

const DEVELOPMENT_BUILD_DIR = 'development_build'
const PRODUCTION_BUILD_DIR = 'production_build'
const PRODUCTION_BUILD_ZIP_FILENAME = 'production_build.zip'

const DEVELOPMENT_BUILD_GD_DIR = 'build'
const PRODUCTION_BUILD_GD_DIR = 'build_prod'

const PRODUCTION_BUILD_ZIP_FILENAME_PATH = path.join(
    ROOT_PATH,
    PRODUCTION_BUILD_ZIP_FILENAME
)
const DEVELOPMENT_BUILD_DIR_PATH = path.join(ROOT_PATH, DEVELOPMENT_BUILD_DIR)
const PRODUCTION_BUILD_DIR_PATH = path.join(ROOT_PATH, PRODUCTION_BUILD_DIR)
const FOLDER_MIMETYPE = 'application/vnd.google-apps.folder'

const auth = new google.auth.OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
)

auth.setCredentials(token)

const drive = google.drive({
    version: 'v3',
    auth,
})

const groupFiles = (paths: string[]): { files: string[]; folders: string[] } =>
    paths.reduce(
        (acc, item) => {
            if (fs.statSync(item).isDirectory()) {
                acc.folders.push(item)
            } else {
                acc.files.push(item)
            }
            return acc
        },
        { files: [] as string[], folders: [] as string[] }
    )

const partitionByCount = (items: string[], count: number): string[][] => {
    const result: string[][] = []
    for (let i = 0; i < items.length; i += count) {
        result.push(items.slice(i, i + count))
    }
    return result
}

const uploadFiles = async (dirPath: string, googleDriveFolderId: string) => {
    const files = fs.readdirSync(dirPath)

    const filesPaths = files.map((file) => path.join(dirPath, file))
    const grouped = groupFiles(filesPaths)

    const filesToUpload = partitionByCount(
        grouped.files,
        PARALLEL_UPLOADS_COUNT
    )

    for (let i = 0; i < filesToUpload.length; i++) {
        await Promise.all(
            filesToUpload[i].map((file) =>
                uploadFile(file, googleDriveFolderId)
            )
        )
    }

    for (let i = 0; i < grouped.folders.length; i++) {
        const folderPath = grouped.folders[i]
        const googleFolder = await drive.files.create({
            requestBody: {
                name: path.basename(folderPath),
                parents: [googleDriveFolderId],
                mimeType: FOLDER_MIMETYPE,
            },
        })
        console.log(`Created folder ${folderPath}`) // eslint-disable-line no-console
        if (!googleFolder.data.id) {
            throw new Error('dont get id from folder creation')
        }
        await uploadFiles(folderPath, googleFolder.data.id)
    }
}

const uploadFile = async (filePath: string, googleDriveFolderId: string) => {
    await drive.files.create({
        requestBody: {
            name: path.basename(filePath),
            parents: [googleDriveFolderId],
        },
        media: {
            body: fs.createReadStream(filePath),
        },
    })
    console.log(`Uploaded ${filePath}`) // eslint-disable-line no-console
}

const main = async () => {
    const {
        data: { files = [] },
    } = await drive.files.list({
        q: `'${DRIVE_FOLDER_ID}' in parents`,
    })

    await Promise.all(
        files
            .map((file) => file.id)
            .filter((id): id is string => !!id)
            .map((fileId) => drive.files.delete({ fileId }))
    )

    const buildFolder = await drive.files.create({
        requestBody: {
            name: DEVELOPMENT_BUILD_GD_DIR,
            parents: [DRIVE_FOLDER_ID],
            mimeType: FOLDER_MIMETYPE,
        },
    })

    if (!buildFolder.data.id) {
        throw new Error('dont get id from folder creation')
    }

    const buildProdFolder = await drive.files.create({
        requestBody: {
            name: PRODUCTION_BUILD_GD_DIR,
            parents: [DRIVE_FOLDER_ID],
            mimeType: FOLDER_MIMETYPE,
        },
    })

    if (!buildProdFolder.data.id) {
        throw new Error('dont get id from folder creation')
    }

    await uploadFiles(DEVELOPMENT_BUILD_DIR_PATH, buildFolder.data.id)
    await uploadFiles(PRODUCTION_BUILD_DIR_PATH, buildProdFolder.data.id)
    await uploadFile(PRODUCTION_BUILD_ZIP_FILENAME_PATH, DRIVE_FOLDER_ID)

    // eslint-disable-next-line no-console
    console.log('Google upload success')
}

main()

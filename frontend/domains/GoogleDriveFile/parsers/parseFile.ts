import {
    array,
    combine,
    object,
    parseDate,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { File } from '@zeal/domains/GoogleDriveFile'

export const parseFile = (input: unknown): Result<unknown, File> => {
    return object(input).andThen((obj) =>
        shape({
            id: string(obj.id),
            name: string(obj.name),
            modifiedTime: string(obj.modifiedTime)
                .andThen(parseDate)
                .map((date) => date.valueOf()),
        })
    )
}

export const parseFiles = (input: unknown): Result<unknown, File[]> =>
    object(input).andThen((obj) =>
        array(obj.files).andThen((arr) => combine(arr.map(parseFile)))
    )

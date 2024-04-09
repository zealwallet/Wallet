import { failure, Result, success } from '../Result'

type JSONParseError = { type: 'unable_to_parse_json'; value: unknown }

export const parse = (value: string): Result<JSONParseError, unknown> => {
    try {
        return success(JSON.parse(value))
    } catch (e) {
        return failure({ type: 'unable_to_parse_json', value })
    }
}

import { Grammars } from 'ebnf'
import memoize from 'lodash.memoize'
import { notReachable } from '../notReachable'

type Path = {
    type: 'path'
    children: Domain[]
}

type Domain = {
    type: 'domain'
    children: (Domain | Feature | Internal | Name)[]
}

export type Internal = {
    type: 'internal'
    text: string
}

type Feature = {
    type: 'feature'
    children: (Internal | Name)[]
}

type Name = {
    type: 'name'
    text: string
}

export type Node = Path | Domain | Internal | Feature | Name

type Parser = (path: string) => Path

export const createParser = (pathPrefix: string): Parser => {
    // Playground https://menduz.github.io/ebnf-highlighter/
    const astParser = new Grammars.W3C.Parser(`
path ::= "${pathPrefix}" domain

domain ::= name ("/domains/" domain | "/features/" feature | "/" internal)?
feature ::= name ([#x000A] | "/" internal)?
internal ::= ([#x0-#xFFFF])+
name ::= [A-Z] [a-zA-Z]*
`)

    const parse = (path: string): Path => astParser.getAST(path) as Path
    return memoize(parse)
}

const toString = (node: Node): string => {
    switch (node.type) {
        case 'domain':
        case 'feature':
            return `${node.type}"${traverseToName(node)?.text}"`

        case 'path':
            return 'path'

        case 'internal':
        case 'name':
            return node.text

        default:
            return notReachable(node)
    }
}

export const traverse = (node: Node, start: string[]): string[] => {
    switch (node.type) {
        case 'domain':
        case 'feature':
        case 'path': {
            const child = node.children.find((node: Node): boolean => {
                switch (node.type) {
                    case 'domain':
                    case 'feature':
                        return true

                    case 'path':
                    case 'internal':
                    case 'name':
                        return false

                    default:
                        return notReachable(node)
                }
            })

            const newStart = [...start, toString(node)]

            return child ? traverse(child, newStart) : newStart
        }

        case 'internal':
            return start

        case 'name':
            return start

        default:
            throw new Error('not reachable')
    }
}

export const traverseToName = (node: Node): Name | null => {
    switch (node.type) {
        case 'path':
        case 'domain':
        case 'feature': {
            const child = node.children.find((node: Node): boolean => {
                switch (node.type) {
                    case 'path':
                    case 'domain':
                    case 'name':
                    case 'feature':
                        return true

                    case 'internal':
                        return false

                    default:
                        return notReachable(node)
                }
            })

            return child ? traverseToName(child) : null
        }

        case 'internal':
            return null
        case 'name':
            return node

        default:
            return notReachable(node)
    }
}

export const traverseToInternal = (node: Node): Internal | null => {
    switch (node.type) {
        case 'domain':
        case 'feature':
        case 'path': {
            const child = node.children.find((node: Node): boolean => {
                switch (node.type) {
                    case 'path':
                    case 'domain':
                    case 'internal':
                        return true

                    case 'feature':
                    case 'name':
                        return false

                    default:
                        throw new Error('not reachable')
                }
            })

            return child ? traverseToInternal(child) : null
        }

        case 'internal':
            return node

        case 'name':
            return null

        default:
            throw new Error('not reachable')
    }
}

export const traverseToFeature = (node: Node): Feature | null => {
    switch (node.type) {
        case 'domain':
        case 'path': {
            const child = node.children.find((node: Node): boolean => {
                switch (node.type) {
                    case 'path':
                    case 'domain':
                    case 'feature':
                        return true

                    case 'internal':
                    case 'name':
                        return false

                    default:
                        throw new Error('not reachable')
                }
            })

            return child ? traverseToFeature(child) : null
        }

        case 'feature':
            return node

        case 'internal':
        case 'name':
            return null

        default:
            throw new Error('not reachable')
    }
}

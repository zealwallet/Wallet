import React, { useState } from 'react'

import { Path } from 'slate'
import {
    BaseEditor,
    createEditor,
    Descendant,
    Editor,
    Element,
    Node,
    NodeEntry,
    Text,
    Transforms,
} from 'slate'
import {
    Editable,
    ReactEditor,
    RenderElementProps,
    RenderLeafProps,
    Slate,
    useSlateStatic,
    withReact,
} from 'slate-react'

import { notReachable } from '@zeal/toolkit'
import { failure, Result, success } from '@zeal/toolkit/Result'

import styles from './index.module.scss'

const MAX_DOCUMENT_DEPTH = 2

type CustomText = { text: string }
type Paragraph = { type: 'paragraph'; children: (CustomElement | CustomText)[] }
type Word = { type: 'word'; word: string; children: CustomText[] }
type CustomElement = Paragraph | Word

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor
        Element: CustomElement
        Text: CustomText
    }
}

type Props = {
    errorWordsIndexes: number[] | null
    hidden: boolean
    value: Descendant[] | null
    autoFocus?: boolean
    readOnly?: boolean
    'data-testid'?: string
    onChange: (value: Descendant[]) => void
    onError: (error: unknown) => void
}

const emptyValue: Descendant[] = [
    { type: 'paragraph', children: [{ text: '' }] },
]

const createRenderElement =
    ({
        hidden,
        errorWordsIndexes,
        readOnly,
    }: {
        hidden: boolean
        errorWordsIndexes: number[] | null
        readOnly?: boolean
    }) =>
    (props: RenderElementProps) => {
        const { element } = props

        switch (element.type) {
            case 'word':
                return (
                    <WordComponent
                        errorWordsIndexes={errorWordsIndexes}
                        hidden={hidden}
                        attributes={props.attributes}
                        element={element}
                        readOnly={readOnly}
                    >
                        {props.children}
                    </WordComponent>
                )

            case 'paragraph':
                return <div {...props.attributes}>{props.children}</div>

            default:
                return notReachable(element)
        }
    }

const renderLeaf = (props: RenderLeafProps) => {
    return <TextComponent {...props} />
}

const TextComponent: React.FC<RenderLeafProps> = ({
    attributes,
    children,
    text,
}) => {
    const editor = useSlateStatic()
    const path = ReactEditor.findPath(editor, text)
    const parent = Node.parent(editor, path)

    const neighborTextsWithPaths: [Node, Path][] = parent.children
        .filter(Text.isText)
        .map((text): [Node, Path] => [text, ReactEditor.findPath(editor, text)])

    const index: number | null =
        neighborTextsWithPaths.findIndex(
            ([_, nodePath]) => nodePath.join(';') === path.join(';')
        ) ?? null

    const classNames = [
        styles.TextNode,
        text.text === '' && styles.EmptyText,
        index === neighborTextsWithPaths.length - 1 && styles.LastText,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <span data-index={index} className={classNames} {...attributes}>
            {children}
        </span>
    )
}

const WordComponent = ({
    attributes,
    children,
    element,
    hidden,
    errorWordsIndexes,
    readOnly = false,
}: {
    attributes: object
    children: unknown
    element: Word
    hidden: boolean
    errorWordsIndexes: number[] | null
    readOnly?: boolean
}) => {
    const editor = useSlateStatic()

    const path = ReactEditor.findPath(editor, element)
    const parent = Node.parent(editor, path)

    const neighborWordsWithPaths: [Word, Path][] = parent.children
        .filter(Element.isElement)
        .filter((node): node is Word => {
            if (!Element.isElement(node)) {
                return false
            }

            switch (node.type) {
                case 'paragraph':
                    return false

                case 'word':
                    return true

                default:
                    return notReachable(node)
            }
        })
        .map((word) => [word, ReactEditor.findPath(editor, word)])

    const index: number | null =
        neighborWordsWithPaths.findIndex(
            ([_, wordPath]) => wordPath.join(';') === path.join(';')
        ) ?? null

    const selected =
        !readOnly &&
        editor.selection?.anchor.path.slice(0, path.length).join(';') ===
            path.join(';')

    const classNames = [
        styles.Word,
        selected && styles.Selected,
        errorWordsIndexes?.includes(index) && styles.Errored,
    ]
        .filter(Boolean)
        .join(' ')

    const text = hidden ? '••••' : Node.string(element).toLowerCase()

    return (
        <span
            className={classNames}
            data-resetko-path={path.join(';')}
            data-resetko-selection={editor.selection?.anchor.path}
            {...attributes}
        >
            <>
                {index !== null ? `${index + 1}. ${text}` : text}
                {children}
            </>
        </span>
    )
}

const tryCreateWords = (editor: Editor): Result<CreateWordError, string> => {
    const { selection } = editor

    if (!selection) {
        return failure('no_editor_selection')
    }

    if (selection.anchor.path.length > MAX_DOCUMENT_DEPTH) {
        return failure('can_not_create_word_within_another_word')
    }

    const currentNode = Node.get(editor, selection.anchor.path)

    if (!Text.isText(currentNode)) {
        return failure('current_node_is_not_a_text')
    }

    if (!currentNode.text.trim().length) {
        return failure('current_text_length_is_zero')
    }

    const beforeText = currentNode.text.trim()

    Transforms.delete(editor, { at: selection.anchor.path })

    const words = beforeText.replace(/\s\s+/gim, ' ').split(' ')

    words.forEach((word) => {
        Transforms.insertNodes(
            editor,
            {
                type: 'word',
                word: word,
                children: [{ text: word }],
            },
            { select: false }
        )
        Transforms.move(editor, {
            distance: 1,
            unit: 'character',
        })
    })

    return success(beforeText)
}

type CreateWordError =
    | 'no_editor_selection'
    | 'current_node_is_not_a_text'
    | 'current_text_length_is_zero'
    | 'can_not_create_word_within_another_word'

const withWords = (
    editor: Editor,
    onError: (error: unknown) => void
): Editor => {
    const { insertText, normalizeNode, insertData } = editor

    editor.normalizeNode = (entry: NodeEntry): void => {
        const [node, path] = entry

        // We want to kill any text nodes which are not in the main paragraph
        if (Text.isText(node) && path.length !== MAX_DOCUMENT_DEPTH) {
            Transforms.removeNodes(editor, { at: path })
        }

        // If the element is a paragraph, ensure its children are valid.
        if (Element.isElement(node) && node.type === 'paragraph') {
            const childCount = node.children.length

            for (const [child, childPath] of Node.children(editor, path)) {
                // If we have a Text node in paragraph - we want to delete all
                // non-empty text nodes which are not at the end of the paragraph
                // disallowing input between words (per spec)
                if (
                    Text.isText(child) &&
                    child.text !== '' &&
                    childPath[1] !== childCount - 1
                ) {
                    Transforms.removeNodes(editor, { at: childPath })
                    Transforms.move(editor, {
                        distance: 1,
                        unit: 'character',
                    })
                    return
                }
            }
        }

        normalizeNode(entry)
    }

    editor.insertBreak = () => {
        const result = tryCreateWords(editor)

        switch (result.type) {
            case 'Failure':
                switch (result.reason) {
                    case 'no_editor_selection':
                    case 'current_node_is_not_a_text':
                    case 'can_not_create_word_within_another_word':
                        onError(result.reason)
                        break

                    case 'current_text_length_is_zero':
                        // It's fine in that case, zero length could appear if user just spam break
                        break

                    default:
                        notReachable(result.reason)
                }
                return

            case 'Success':
                return

            default:
                return notReachable(result)
        }
    }

    editor.insertText = (text: string) => {
        const { selection } = editor

        if (text.endsWith(' ') && selection) {
            const result = tryCreateWords(editor)

            switch (result.type) {
                case 'Failure':
                    switch (result.reason) {
                        case 'no_editor_selection':
                        case 'current_node_is_not_a_text':
                        case 'can_not_create_word_within_another_word':
                            onError(result.reason)
                            break

                        case 'current_text_length_is_zero':
                            // It's fine in that case, zero length could appear if user just spam space
                            break

                        default:
                            notReachable(result.reason)
                    }
                    return

                case 'Success':
                    return

                default:
                    return notReachable(result)
            }
        }

        insertText(text)
    }

    // Paste handling
    editor.insertData = (data: DataTransfer) => {
        insertData(data)

        // Try to create words AFTER insertion
        tryCreateWords(editor)
    }

    editor.isInline = (element) => {
        switch (element.type) {
            case 'paragraph':
                return false
            case 'word':
                return true
            default:
                return notReachable(element)
        }
    }

    editor.isVoid = (element: CustomElement): boolean => {
        switch (element.type) {
            case 'paragraph':
                return false

            case 'word':
                return true

            default:
                return notReachable(element)
        }
    }

    return editor
}

export const getPhraseString = (value: Descendant[] | null): string =>
    (value || [])
        .filter(Element.isElement)
        .map((element) => element.children)
        .flat()
        .filter(Element.isElement)
        .filter((element): element is Word => {
            switch (element.type) {
                case 'paragraph':
                    return false
                case 'word':
                    return true

                default:
                    return notReachable(element)
            }
        })
        .flatMap((word) => word.children)
        .flatMap(({ text }) => text.toLowerCase())
        .join(' ')

export const getDescendantsFromString = (input: string): Descendant[] => {
    const words = input
        .trim()
        .split(' ')
        .map(
            (word: string): Word => ({
                type: 'word',
                word,
                children: [{ text: word }],
            })
        )

    return [{ type: 'paragraph', children: [...words, { text: '' }] }]
}

export const SecretPhraseInput = ({
    value,
    errorWordsIndexes,
    hidden,
    autoFocus,
    readOnly,
    'data-testid': testId,
    onChange,
    onError,
}: Props) => {
    const [editor] = useState<BaseEditor & ReactEditor>(() =>
        withWords(withReact(createEditor()), onError)
    )

    return (
        <div className={styles.Container} data-testid={testId}>
            <Slate
                editor={editor}
                value={value || emptyValue}
                onChange={onChange}
            >
                <Editable
                    autoFocus={autoFocus}
                    readOnly={readOnly}
                    renderElement={createRenderElement({
                        hidden,
                        errorWordsIndexes,
                        readOnly,
                    })}
                    renderLeaf={renderLeaf}
                    onBlur={() => {
                        const result = tryCreateWords(editor)

                        switch (result.type) {
                            case 'Failure':
                                switch (result.reason) {
                                    case 'current_node_is_not_a_text':
                                        onError(result.reason)
                                        break

                                    case 'can_not_create_word_within_another_word':
                                        // It's fine in that case, because user can select existing word and then blur
                                        break

                                    case 'current_text_length_is_zero':
                                    case 'no_editor_selection':
                                        // It's fine in that case, zero length could appear if user blur empty input
                                        break

                                    default:
                                        notReachable(result.reason)
                                }
                                return

                            case 'Success':
                                return

                            default:
                                return notReachable(result)
                        }
                    }}
                />
            </Slate>
        </div>
    )
}

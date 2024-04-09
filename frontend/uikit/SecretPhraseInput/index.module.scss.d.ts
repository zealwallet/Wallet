export type Styles = {
    Container: string
    EmptyText: string
    Errored: string
    LastText: string
    Selected: string
    TextNode: string
    Word: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles

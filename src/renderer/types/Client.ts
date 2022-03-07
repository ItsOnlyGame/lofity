export interface Option {
    name: string,
    slug: string | Option[],
    visible?: boolean
}

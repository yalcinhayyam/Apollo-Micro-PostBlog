import { Model } from "mongoose"

interface Node<T> {
    [key: string]: [keyof T]
}
interface Edge<T> {
    cursor: string
    node: T
}
interface PageInfo {
    startCursor?: string
    hasNextPage: boolean
    hasPreviousPage: boolean
    endCursor: ?string
}

interface Connection<T> {
    nodes: Node<T>[]
    edges: Edge<T>[]
    pageInfo: PageInfo
}


async function paginate<T>(source: Model, count: number, query?: FilterQuery<T>, first: number, after: string): Connection<T>
async function subFieldPaginate<T>(source: T[], first: number, after: string): Connection<T>


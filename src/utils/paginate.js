export const paginate = async (source, count, first = 10, after) => {
  source = source.limit(first)
  if (after) {
    source = source.find({
      _id: { $lt: after }
    })
  }

  const result = await source.find().sort({
    _id: -1
  })

  return {
    nodes: result,
    edges: result.map((item) => ({
      cursor: item.id,
      node: item
    })),
    pageInfo: {
      startCursor: result?.[0]?.id || null,
      hasNextPage: result.length > 0,
      hasPreviousPage: (await count) - result.length > 0,
      endCursor: result?.[result?.length - 1]?.id || null
    }
  }
}

const paginateWithQuery = async (
  source,
  count,
  query = {},
  first = 10,
  after
) => {
  if (query) {
    source = source.find(query)
  }

  source = source.limit(first)
  if (after) {
    source = source.find({
      _id: { $lt: after }
    })
  }

  const result = await source.find().sort({
    _id: -1
  })
  return {
    nodes: result,
    edges: result.map((item) => ({
      cursor: item.id,
      node: item
    })),
    pageInfo: {
      startCursor: result?.[0]?.id || null,
      hasNextPage: result.length > 0,
      hasPreviousPage: count - result.length > 0,
      endCursor: result?.[result?.length - 1]?.id || null
    }
  }
}

export const subFieldPaginate = (source = [], first = 5, after) => {
  const itemIndex = source.findIndex(({ id }) => id == after)

  const result = source.reduce(
    (prev, current, index) =>
      index > (itemIndex || 0) && (itemIndex || 0) + first >= index
        ? [...prev, current]
        : prev,
    []
  )

  return {
    nodes: result,
    edges: result.map((item) => ({
      cursor: item.id,
      node: item
    })),
    pageInfo: {
      startCursor: result?.[0]?.id || null,
      hasNextPage: (itemIndex || 0) + 1 + first < source.length,
      hasPreviousPage: itemIndex + 1 > 0,
      endCursor: result?.[result?.length - 1]?.id || null
    }
  }
}

// var result = subFieldPaginate(
//     [
//         { id: 1, value: "1" },
//         { id: 2, value: "2" },
//         { id: 3, value: "3" },
//         { id: 4, value: "4" },
//         { id: 5, value: "5" }
//     ], 2, 2)

// console.log(result)

// async function test() {
//     console.log(await paginate(Post, await Post.count() ,{}, 10, "6314c2d48bf0b1058b7139e7"))

// }
// test()

interface ListItems {
  (items: any[], pageActual: number, limitItems: number)
}

const listItems: ListItems = (items, pageActual, limitItems) => {
  const result = []
  const totalPage = Math.ceil(items.length / limitItems)
  let count = pageActual * limitItems - limitItems
  const delimiter = count + limitItems

  if (pageActual <= totalPage) {
    for (let i = count; i < delimiter; i++) {
      if (items[i]) {
        result.push(items[i])
      }
      count++
    }
  }

  return result
}

export default listItems

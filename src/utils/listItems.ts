interface IListItems {
  (items: any[], pageActual: number, limitItems: number): any[]
}

const listItems: IListItems = (items, pageActual, limitItems) => {
  const itemsInPageActual = []
  const totalPages = Math.ceil(items.length / limitItems)
  let count = pageActual * limitItems - limitItems
  const delimiter = count + limitItems

  if (pageActual <= totalPages) {
    for (let i = count; i < delimiter; i++) {
      if (items[i]) itemsInPageActual.push(items[i])

      count++
    }
  }

  return itemsInPageActual
}

export default listItems

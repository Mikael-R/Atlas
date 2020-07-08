function replaceAll (str: string, searchValues: Array<string>, replaceValue: any) {
  for (const i in searchValues) {
    const searchRegex: RegExp = new RegExp(searchValues[i])

    str = str
      .split('')
      .map(char => char.replace(searchRegex, replaceValue))
      .join('')
  }

  return str
}

export default replaceAll

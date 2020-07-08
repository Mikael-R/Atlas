/* eslint-disable no-extend-native */
declare global {
  interface String {
    replaceAll(searchValues: Array<string>, replaceValue: string): string
  }
}

String.prototype.replaceAll = (searchValues, replaceValue) => {
  let str = String(this)
  for (const i in searchValues) {
    const searchRegex: RegExp = new RegExp(searchValues[i])

    str = str
      .split('')
      .map(char => char.replace(searchRegex, replaceValue))
      .join('')
  }

  return str
}

export {}
/*
The empty export on the bottom is required if you declare global in .ts and
do not export anything. This forces the file to be a module.
*/

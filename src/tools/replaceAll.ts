interface ReplaceAll {
  (text: string | string[], toReplace: string, replace: string): string
}

const replaceAll: ReplaceAll = (text, toReplace, replacer) =>
  text.toString().split(toReplace).join(replacer)

export default replaceAll

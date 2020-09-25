interface ReplaceAll {
  (text: string, toReplace: string, replace: string): string
}

const replaceAll: ReplaceAll = (text, toReplace, replacer) =>
  text.split(toReplace).join(replacer)

export default replaceAll

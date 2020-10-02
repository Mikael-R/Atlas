import { readdirSync, statSync, existsSync } from 'fs'

interface IListDir {
  (dirPath: string, fullPath?: boolean): {
    dirs: string[] | []
    files: string[] | []
  }
}

const listDir: IListDir = (dirPath, fullPath = true) => {
  const files: string[] = []
  const dirs: string[] = []

  if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) {
    return { dirs, files }
  }

  const dirContent = readdirSync(dirPath)

  dirContent.forEach(content => {
    const path = `${dirPath}/${content}`

    if (statSync(path).isFile()) files.push(fullPath ? path : content)
    if (statSync(path).isDirectory()) dirs.push(fullPath ? path : content)
  })

  return { dirs, files }
}

export default listDir

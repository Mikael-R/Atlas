import { readdirSync, statSync, existsSync } from 'fs'

interface IListDirSync {
  (dirPath: string, fullPath?: boolean): {
    dirs: string[] | []
    files: string[] | []
  }
}

const listDirSync: IListDirSync = (dirPath, fullPath = true) => {
  const dirs: string[] = []
  const files: string[] = []

  if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) {
    return { dirs, files }
  }

  const dirContent = readdirSync(dirPath)

  for (const content of dirContent) {
    const path = `${dirPath}/${content}`

    if (statSync(path).isDirectory()) dirs.push(fullPath ? path : content)
    if (statSync(path).isFile()) files.push(fullPath ? path : content)
  }

  return { dirs, files }
}

export default listDirSync

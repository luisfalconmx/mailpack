import { cwd } from 'process'
import { resolve } from 'path'
import { mkdir, readdir, writeFile, readFile } from 'fs/promises'
import type { IDirectory } from './create.d'

const create = async (dir: string) => {
  try {
    // Verify if directory not exists or its empty
    const src = resolve(__dirname, '../../')
    const targetDir = `${cwd()}/${dir}`
    await mkdir(targetDir, { recursive: true })
    const dirContents = await readdir(targetDir, { recursive: true })

    if (dirContents.length >= 1) {
      throw new Error('directory is not empty')
    }

    // Register files and directories that will be generated
    const directories = [
      {
        name: 'templates',
        files: [
          {
            name: 'main.pug',
            data: await readFile(`${src}/static/main.pug`)
          }
        ]
      },
      {
        name: 'data',
        files: [
          {
            name: 'octocat.json',
            data: await readFile(`${src}/static/octocat.json`)
          },
          {
            name: 'sammy.json',
            data: await readFile(`${src}/static/sammy.json`)
          }
        ]
      }
    ]

    // Generate files and directories
    const iterateDirectories = async (directories: IDirectory[]) => {
      for (const directory of directories) {
        const output = `${targetDir}/${directory.name}`
        await mkdir(output)
        for (const file of directory.files) {
          writeFile(`${output}/${file.name}`, file.data)
        }
      }
    }

    await iterateDirectories(directories)

    // Notify when job finished
    console.log('\x1b[32m', 'Files created successfully!')
    console.log('\x1b[90m', targetDir)
  } catch (error) {
    throw error
  }
}

export default create

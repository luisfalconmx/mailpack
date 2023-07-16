import { versions } from 'process'
import { program } from 'commander'
import { name, description, version } from './package.json'
import create from './commands/create'

// Detect node version
const currentNodeVersion: string = versions.node
const semver: string[] = currentNodeVersion.split('.')
const major: number = parseFloat(semver[0])
const minimumVersion = 14
const errorMesagge: string = 'mailpack requires Node 14 or higher.'

// Validate node version
if (major < minimumVersion) {
  console.log('\x1b[31m')
  throw new Error(errorMesagge)
}

// Register program info
program.name(name).description(description).version(version)

// Register all commands
program
  .command('setup')
  .description('Initialize a empty project with all required files')
  .action(() => create('src'))

program
  .command('create')
  .description('Create a new folder with all required files')
  .argument(
    '<directory>',
    'Specifies the path where the files will be generated'
  )
  .action((dir: string) => create(dir))

// Setting options and invoking commands
program.parse()

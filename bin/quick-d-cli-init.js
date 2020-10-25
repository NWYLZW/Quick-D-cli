#!/usr/bin/env node
const fs        = require('fs')
const fse       = require('fs-extra')
const path      = require('path')
const { exec }  = require('child_process')
const iconv     = require('iconv-lite')
const ora       = require('ora')
const chalk     = require('chalk')
const inquirer  = require('inquirer')

const tplPkgFileObj = require('../template/base/package')

const cwdPath = process.cwd()
const defaultName = path.basename(cwdPath)

let question = [{
    name: 'name',
    type: 'input',
    message: `Please enter the project name(${defaultName})`,
    default: defaultName
}, {
    name: 'author',
    type: 'input',
    message: 'Please enter the project author'
}, {
    name: 'description',
    type: 'input',
    message: 'Please enter the project description'
}, {
    name: 'license',
    type: 'input',
    message: 'Please enter the project license(ISC)',
    default: 'ISC'
}, {
    name: 'packageTool',
    type: 'list',
    message: 'Please enter the project package tool',
    choices: [
        'npm', 'cnpm', 'yarn'
    ]
}, {
    name: 'useGit',
    type: 'confirm',
    message: 'Whether to use git(Y)',
    default: true
}]

inquirer
.prompt(question).then(answers => {
    let spinner = ora('Copying template ...\n')
    spinner.start()

    const pkgFileObj = {
        ...tplPkgFileObj,
        name:        answers.name,
        author:      answers.author,
        description: answers.description,
        license:     answers.license,
    }

    fse.copySync(
        path.join(__dirname, '../template/base'),
        path.join(cwdPath, './')
    )
    fs.writeFileSync(
        path.join(cwdPath, './package.json'),
        JSON.stringify(
            pkgFileObj, null, 2
        )
    )
    spinner.stop()

    const initGit = _ => {
        return new Promise((resolve, reject) => {
            if (answers.useGit) {
                exec('git init', {
                    encoding: 'buffer',
                    cwd: cwdPath
                }, (err, stdout) => {
                    if (err) {
                        console.log(err)
                        reject(); return
                    }
                    console.log(iconv.decode(stdout, 'cp936'))

                    fse.copySync(
                        path.join(__dirname, '../template/.gitignore'),
                        path.join(cwdPath, './.gitignore')
                    )
                    resolve()
                })
            } else {
                resolve()
            }
        })
    }
    const packageInit = _ => {
        return new Promise((resolve, reject) => {
            let spinner = ora('Initializing node modules ...\n')
            spinner.start()
            exec(`${answers.packageTool} install`, {
                encoding: 'buffer',
                cwd: cwdPath
            }, (err, stdout) => {
                spinner.stop()
                if (err) {
                    console.log(err)
                    reject(); return
                }
                console.log(iconv.decode(stdout, 'cp936'))
                resolve()
            })
        })
    }

    initGit().then(_ => {
        packageInit().then(_ => {
            console.log(chalk.green('Created successfully'))
        }).catch(_ => {
            console.log(chalk.red('Init node modules failure'))
        })
    }).catch(_ => {
        console.log(chalk.red('Init git warehouse failure'))
    })
})

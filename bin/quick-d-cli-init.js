#!/usr/bin/env node
const fs        = require('fs')
const fse       = require('fs-extra')
const glob      = require('glob')
const path      = require('path')
const { exec }  = require('child_process')
const iconv     = require('iconv-lite')
const ora       = require('ora')
const chalk     = require('chalk')
const inquirer  = require('inquirer')

const tool = require('../tool')

const tplPkgFileObj = require('../template/base/package')

// 通过正则设置忽略被批量删除的文件或文件夹
const ignoreRegexes = [
    // /dev\.ejs$/
]

// 获取命令行执行命令的路径
const cwdPath = process.cwd()
// 项目的默认名
const defaultName = path.basename(cwdPath)

const question = [{
    name: 'name',
    type: 'input',
    message: `Please enter the project name`,
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
    message: 'Please enter the project license',
    default: 'ISC'
}, {
    name: 'packageTool',
    type: 'list',
    message: 'Please enter the project package tool',
    choices: [
        'npm', 'cnpm', 'yarn'
    ]
}, {
    name: 'autoInstall',
    type: 'confirm',
    message: 'Whether to install the module automatically',
    default: false
}, {
    name: 'useGit',
    type: 'confirm',
    message: 'Whether to use git',
    default: true
}, {
    name: 'selDataBaseSystem',
    type: 'checkbox',
    message: 'Please enter the project database',
    choices: [{
        name: 'mongodb',
        checked: false
    }, {
        name: 'mysql',
        checked: false
    }]
}]

inquirer
.prompt(question).then(async answers => {
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

    const selDataBaseSystem = answers.selDataBaseSystem.length !== 0
    const dbAbles = {
        selMongoDB: answers.selDataBaseSystem.indexOf('mongodb') !== -1,
        selMysql: answers.selDataBaseSystem.indexOf('mysql') !== -1,
        selDataBaseSystem: selDataBaseSystem
    }
    console.log(dbAbles)
    if (!selDataBaseSystem) {
        delete pkgFileObj.dependencies.mongodb
        delete pkgFileObj.dependencies.mongoose
    } else {
        fs.writeFileSync(
            './src/plugin/dataBaseServer.js',
            await tool.render(
                require('path').join(cwdPath, './src/plugin/dataBaseServer.ejs'), dbAbles, 'utf-8'
            )
        )
        fse.copySync(
            path.join(__dirname, '../template/model'),
            path.join(cwdPath, './src/model')
        )
    }
    fs.writeFileSync(
        path.join(cwdPath, './package.json'),
        JSON.stringify(
            pkgFileObj, null, 2
        )
    )

    const targetsFilePaths = [
        path.join(cwdPath, './src/controller/HomeController'),
        path.join(cwdPath, './src/plugin/index'),
        path.join(cwdPath, './src/config/dev'),
        path.join(cwdPath, './src/config/pro')
    ]
    for (const targetsFilePath of targetsFilePaths) {
        fs.writeFileSync(
            `${targetsFilePath}.js`,
            await tool.render(`${targetsFilePath}.ejs`, dbAbles, 'utf-8')
        )
    }

    const files = glob.sync(cwdPath + '/src/**/*.ejs') || []
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        let unlink = true
        for (let j = 0; j < ignoreRegexes.length; j++) {
            const ignoreRegex = ignoreRegexes[j] || /.*/
            if (ignoreRegex.test(file)) {
                unlink = false
                break
            }
        }
        unlink && fs.unlinkSync(file)
    }
    spinner.stop()

    try {
        if (answers.useGit) {
            await tool.initGit()
        }
        if (answers.autoInstall) {
            await tool.packageInit(answers.packageTool)
        }
        console.log(chalk.green('Created successfully'))
    } catch (e) {
        console.log(chalk.red(e.message))
    }
})

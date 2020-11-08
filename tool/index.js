/**
 * @desc    帮助方法 index.js
 * @author  yijie
 * @date    2020-10-30 11:30
 * @logs[0] 2020-10-30 11:30 yijie 创建了index.js文件
 */
const fse       = require('fs-extra')
const path      = require('path')
const { exec }  = require('child_process')
const iconv     = require('iconv-lite')
const cheerio   = require('cheerio')
const ejs       = require('ejs')

// 获取命令行执行命令的路径
const cwdPath = process.cwd()

module.exports = {
    /**
     * 渲染对应的ejs文件
     * @param filePath  ejs文件路径
     * @param data      传入数据
     * @param option    参数
     * @returns {Promise<string>}
     */
    render (filePath, data, option) {
        return new Promise((resolve, reject) => {
            ejs.renderFile(filePath, data, option, (err, str) => {
                if (err) {
                    reject(err)
                    return
                }
                const $ = cheerio.load(str)
                const scriptContent = $('#content')
                    .html().substr(1)
                resolve(scriptContent)
            })
        })
    },

    /**
     * 初始化git仓库
     * @returns {Promise<>}
     */
    initGit() {
        return new Promise((resolve, reject) => {
            exec('git init', {
                encoding: 'buffer',
                cwd: cwdPath
            }, (err, stdout) => {
                if (err) {
                    err.message = 'Init git warehouse failure'
                    reject(err); return
                }
                console.log(iconv.decode(stdout, 'cp936'))

                fse.copySync(
                    path.join(__dirname, '../template/.gitignore'),
                    path.join(cwdPath, './.gitignore')
                )
                resolve()
            })
        })
    },
    /**
     * 初始化node_modules
     * @param packageToolName   包管理工具名
     * @returns {Promise<unknown>}
     */
    packageInit (packageToolName) {
        return new Promise((resolve, reject) => {
            let spinner = ora('Initializing node modules ...\n')
            spinner.start()
            exec(`${packageToolName} install`, {
                encoding: 'buffer',
                cwd: cwdPath
            }, (err, stdout) => {
                spinner.stop()
                if (err) {
                    err.message = 'Init node modules failure'
                    reject(err); return
                }
                console.log(iconv.decode(stdout, 'cp936'))
                resolve()
            })
        })
    }
}

/**
 * @desc    帮助方法 index.js
 * @author  yijie
 * @date    2020-10-30 11:30
 * @logs[0] 2020-10-30 11:30 yijie 创建了index.js文件
 */
const cheerio = require('cheerio')
const ejs     = require('ejs')

const fs = require('fs')

module.exports = {
    /**
     * 按照if条件保留代码块
     * @param filePath  文件路径
     * @param able      条件信息字典
     * @returns {string}
     */
    replaceByIfCommand (filePath, able) {
        const content = fs.readFileSync(filePath).toString()

        const segments = content
            .replace('\r\n', '\n')
            .split('\/\/ endif\n')

        const replaceBlanks = []

        for (let i = 0;i < segments.length;i++) {
            const segment = segments[i] + '\/\/ endif'
            const ifSegment = (segment.match(
                /\s*\/\/\ if\ \((.*)\).*(\/\/\ endif)?/sgm
            ) || [''])[0]
            if (ifSegment.trim() === '') continue

            const args = ifSegment.match(/\/\/\ if\ \((.*)\)/) || [ '', '' ]
            if (!(able[args[1]] || false)) {
                replaceBlanks.push(ifSegment)
            }
        }

        let baseStr = content
        replaceBlanks.forEach(replaceBlank => {
            baseStr = baseStr.replace(replaceBlank, '')
        })
        return baseStr
            .replace(/\n?\s*\/\/\ if\ \((.*)\)/g, '')
            .replace(/\n?\s*\/\/ endif/g, '')
    },

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
    }
}

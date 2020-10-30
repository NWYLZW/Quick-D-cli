/**
 * @desc    帮助方法 index.js
 * @author  yijie
 * @date    2020-10-30 11:30
 * @logs[0] 2020-10-30 11:30 yijie 创建了index.js文件
 */
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
    }
}

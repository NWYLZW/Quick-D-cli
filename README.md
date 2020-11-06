# quick-d-cli

quick-d 框架的cli工具

## 如何使用

### 安装yarn

* `npm install -g cnpm --registry=https://registry.npm.taobao.org`

    全局安装淘宝包管理器cnpm

* `cnpm install -g yarn`

    全局安装超级快的包管理器yarn

* `yarn config set registry https://registry.npm.taobao.org/`

    设置yarn的仓库源为淘宝源

(PS:[有关包管理器之间根本区别的文章](https://zhuanlan.zhihu.com/p/137535779))

### 使用quick-d-cli创建一个基于koa的quick-d项目

* `yarn global add quick-d-cli`

    全局安装quick-d的cli工具

* 初始化项目

```shell
mkdir project && cd project
quick-d-cli init
```

选择yarn作为项目的包管理器

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02e579c01d074633ac57857f25e4f97b~tplv-k3u1fbpfcp-watermark.image)

安装过程会稍微等待比较久的时间，如果安装时出现了网络问题，再在项目下执行一遍`yarn`命令即可

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6088e73f096742e4a9b32c0a012b4884~tplv-k3u1fbpfcp-watermark.image)

出现上图时表示项目已经创建成功了

* 启动项目

`npm run dev`

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4d198e2832444e89ac1ae8703c29111~tplv-k3u1fbpfcp-watermark.image)

出现该界面表示项目已经，启动成功

访问 该[页面](http://localhost:12333/home/hello)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ac09f5b62ac4bde8626df695c1ae66d~tplv-k3u1fbpfcp-watermark.image)

可以看到Hello world在屏幕中间展示

控制台输出了

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29e8042df9334f5ea14fbf1c25ca66e0~tplv-k3u1fbpfcp-watermark.image)

项目启动与访问成功，下面对代码进行一定程度的解析，方便开发

### 如何进行开发

* 选择一款强大的ide，在这里我选择了webStorm(没办法学生优惠实在是太香了，idea系的软件实在是太好用了)。你可以选择自己喜欢的vscode、atom、subline、notepad++。

* 项目结构如下(使用的图标插件是'Atom Material File Icons')
    ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cd8beadcfb14281b4d3eb371755a382~tplv-k3u1fbpfcp-watermark.image)

* node_modules node模块文件

* src 项目源文件，开发环境下使用(执行完`npm run build`后会经过babel编译出一个dist文件，用于生产环境)

    * config 一些配置信息

        * alases.js 模仿webpack的路径重命名软件['@'这种的]
        * dev.js 开发环境下使用的配置文件 (里面设置了环境访问状态与端口，本地可访问)
        * pro.js 生产环境下使用的配置文件 (里面设置了环境访问状态与端口，服务器上公网可访问，本机内网可访问)
        * index.js 对外输出经过环境选择的配置文件

    * controller 路由层文件

        * HomeController.js 一个很简单的路由文件

        ```js
        // 从框架中获取请求装饰器与控制器装饰器
        import { GetRequest } from 'quick-d/lib/common/Request'
        import { Controller } from 'quick-d/lib/common/Controller'
        
        // 设置控制器根路由
        @Controller('/home')
        class HomeController {
          // 设置一个行为路由
          @GetRequest('/hello')
          async hello (ctx) {
            // ctx是koa默认的上下文对象
            // 也可以通过@Context() 参数装饰器获取
            // 还有许多更强大的参数装饰器获取请求中的参数
            console.log(ctx)
            // 语法糖，下面相当于 ctx.body = `<h1>Hello world</h1>`
            return `
              <h1>Hello world</h1>
            `
          }
        }
        ```

    * listener 监听器(可以是事件监听器，也可以是错误监听器)

        * ServerErrorListener.js 服务器异常信息监听器(可以多个，按照方法的权重处理错误异常)

        ```js
        import {
          ErrorListener, ErrorsHandler
        } from 'quick-d/lib/common/Handler'
        import ValueNotDeliveredError from 'quick-d/lib/error/ValueNotDeliveredError'
        
        /**
         * 多例模式，每个异常的处理都是独立的
         */
        class ServerErrorListener extends ErrorListener {
          // 是否打印堆栈信息，默认不打印
          // 该对象必须具有添加ErrorsHandler装饰器的方法
          // 当环境为开发环境时才打印调用堆栈信息
          isLogStack = process.env.NODE_ENV === 'development'
        
          // ErrorsHandler([处理的异常列表], 处理权重)
          // 处理权重越大的先执行
          @ErrorsHandler([ Error ], 1)
          dealError ([ ctx, error ]) {
            console.log('dealError', error)
          }
        
          @ErrorsHandler([ ValueNotDeliveredError ], 10)
          dealValueNotDeliveredError ([ ctx, error ]) {
            console.log('dealValueNotDeliveredError', error)
          }
        }
        ```

    * app.js 项目入口文件

    ```js
    import path from 'path'
    import Koa from 'koa'
    import { registerApp } from 'quick-d'
    import config from './config'
    
    // 实例化一个Koa应用
    const app = new Koa()
    
    // 将应用注册到quick-d框架中
    registerApp(app)
    
    // 搜索目录下的控制层文件
    // 让babel检测到其中的装饰器，触发反射机制，将对应的路由数据注入到容器中
    const controllersFileNames = require('fs').readdirSync(
      path.join(__dirname, '/controller')
    )
    
    for (let controllersNameIndex in controllersFileNames) {
      const controllersName = controllersFileNames[controllersNameIndex]
    
      // 检测是否为js文件
      if (/\.js$/.test(controllersName)) {
        // @是项目根文件夹的src文件夹
        // 您可以在src/config/aliases.js中自定义别名
        require(`@/controller/${controllersName}`)
      }
    }
    
    // 引入监听器文件，触发反射机制
    require('@/listener/ServerErrorListener')
    
    // 启动项目
    app.listen(config.server.port, config.server.host, _ => {
        console.log(
          `Server is running in http://${config.server.host}:${config.server.port}`
        )
    })
    ```

* .babelrc babel的配置文件，用于解决js中不支持装饰器、类型校验、类属性三个特性

* webStorm.config.js由webstorm识别的配置文件，方便ctrl键点到源文件中

* ...其他均与项目关系不大，不仔细介绍了

写开发文档ing

大家使用中有啥问题欢迎在评论区讨论，我看到就会来解答(毕竟我还只是一个学生，挺闲的)

## 计划任务

* [ ] 添加eslint选项用来规范代码风格
* [ ] 添加数据库选项用来选择开发数据库
  * [x] mongodb
    * [x] odm (mongoose)
  * [ ] mysql
* [ ] 添加log4j选项用来记录日志信息
* [ ] 添加是否自动生成接口文档选项，快速进行接口开发与测试
* [ ] 添加1期开发文档
* [ ] 对接前端开发框架vue与react
* [ ] ejs模板处理(我是想做一个纯api的，但是能支持还是支持)
* [ ] 添加2期开发文档
* [ ] 带图形界面的cli工具

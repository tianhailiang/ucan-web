# 文档

## 构建命令
    fis3 release prod # 发布产品库
    (fis3 release prod-path  # 需要配置路径)

该项目依赖百度开源前端框架[fis3](http://fis.baidu.com/)。详细命令请[查看这里](http://fis.baidu.com/fis3/docs/api/command.html)。

## 部署步骤

第1步: 安装fis3

	npm install -g fis3

第2步: 安装fis全局插件

    # hook类
    npm install -g fis3-hook-commonjs

    # parser类
    npm install -g fis-parser-sass
    npm install -g fis-parser-less
    npm install -g fis-parser-template
    npm install -g fis-parser-babel-5.x

    # preprocessor类
    npm install -g fis3-preprocessor-js-require-file
    npm install -g fis3-preprocessor-js-require-css

    # postprocessor类
    npm install -g fis-postprocessor-autoprefixer

    # postpackager类
    npm install -g fis3-postpackager-loader

    # optimizer类
    npm install -g fis-optimizer-html-compress

    # deploy类
    npm install -g fis3-deploy-skip-packed


## 如何运行
开启fis服务器

	fis3 server start

发布

	fis3 release

    fis3 release prod # 发布产品库
    fis3 release prod-path # 发布带域名和path

    fis3 release remote # 发布到指定机器（需要部署远程recevier.php脚本）


## 目录说明
项目的目录树如下：

    ┌─components
    ├─mock
    ├─lib
    ├─modules
    │  ├─js
    │  ├─css
    │  ├─lib
    │  ├─ul
    │  └─html
    └─test

根目录下存放html文件。

- components fis 组件的目录
- lib 存放一些不打包的js库
- modules 项目的组件
	- js 项目用到的全局js
	- css 项目用到的css
	    - config.less 公共配置样式表
	- lib 第三方js
	- ui UI组件
	- html 前端模块
- mock 模拟数据, 远程模拟数据配置

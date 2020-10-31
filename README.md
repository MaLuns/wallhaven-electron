<h1 align="center">wallhaven-electron</h1>

<div align="center">
一款基于 Electron 壁纸客户端 。
</div>

- gitee：https://gitee.com/ml13/wallhaven-electron
- github：https://github.com/MaLuns/wallhaven-electron

## 运行
```
# 安装依赖
yarn

# 运行开发模式
npm run serve:web
npm run serve:exe

# 打包安装文件 
npm run build:web
npm run build:exe

```

## 项目结构
```
- build 打包图标
- layout 前端文件
  - public
  - src
- src
  - main 主线程目录
  - renderer 渲染线程（前端打包输出目录）
```
## 截图
<img src="https://images.cnblogs.com/cnblogs_com/nextl/1873509/o_201031025512demo.png" alt="首页" />
<img src="https://images.cnblogs.com/cnblogs_com/nextl/1873509/o_201031025505demo2.png" alt="分类" />
<img src="https://images.cnblogs.com/cnblogs_com/nextl/1873509/o_201031025530demo5.png" alt="查看" />
<img src="https://images.cnblogs.com/cnblogs_com/nextl/1873509/o_201031025517demo3.png" alt="收藏" />
<img src="https://images.cnblogs.com/cnblogs_com/nextl/1873509/o_201031025522demo4.png" alt="下载" />

## Api
[wallhaven.cc](https://wallhaven.cc/help/api)

## 参与贡献

非常欢迎你的贡献，你可以通过以下方式一起共建 :smiley:：

- 通过 Issue 报告 bug 或进行咨询。
- 提交 Pull Request 改进 wallhaven-electron 的代码。
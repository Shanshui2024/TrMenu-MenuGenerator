# TrMenu 生成器

一个用于 Minecraft 服务器的可视化 TrMenu 菜单配置工具。

## 功能特性

- 📝 **基础设置** - 配置菜单标题、更新间隔、点击延迟等
- 🎨 **布局设计** - 可视化编辑菜单布局网格
- 🔘 **按钮配置** - 创建和编辑菜单按钮及其属性
- 📋 **YAML 预览** - 实时预览生成的 YAML 配置
- 💾 **导出功能** - 一键复制或下载 YAML 文件

## 快速开始

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm start
```

## 技术栈

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式设计
- **js-yaml** - YAML 生成
- **Lucide React** - 图标库

## 使用说明

1. **基础设置** - 配置菜单的基本属性
2. **布局设计** - 使用字符网格定义菜单布局
3. **按钮配置** - 为布局中的字符创建对应的按钮
4. **导出配置** - 复制或下载生成的 YAML 文件到你的服务器

## TrMenu 插件

本工具为 [TrMenu](https://github.com/TrMenu/TrMenu) 插件生成配置文件。

TrMenu 是一个强大的 Minecraft 服务器菜单插件，支持 1.8-1.16+ 版本。

## 许可证

MIT

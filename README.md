# JSON 格式化工具

单页面 React 应用，支持 JSON 格式化、压缩、校验、转 CSV 及文件下载。

## 功能

- **格式化**：将压缩的 JSON 美化输出
- **压缩**：将格式化的 JSON 压缩为单行
- **缩进**：支持 2 空格、4 空格、Tab
- **实时校验**：输入时自动检测 JSON 语法，错误即时提示
- **转 CSV**：将 JSON 数组或对象转换为 CSV 格式
- **语法高亮**：输出区关键字、字符串、数字等彩色显示
- **复制**：一键复制格式化结果
- **下载**：直接下载 JSON 或 CSV 文件（CSV 含 UTF-8 BOM，Excel 友好）
- **深色模式**：默认深色主题

## 运行

```bash
npm install
npm run dev
```

访问 http://localhost:5173

## 构建

```bash
npm run build
```

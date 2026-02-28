# JSON 格式化工具 / JSON Formatter

单页面 React 应用，支持 JSON 格式化、压缩、校验、转 CSV 及文件下载。

A single-page React app for JSON formatting, minifying, validation, CSV conversion and file download.

**在线体验 / Demo**：<https://dsun6652-oss.github.io/easy-json-tool>

## 功能 / Features

- **格式化**：将压缩的 JSON 美化输出 / **Format**: Beautify minified JSON
- **压缩**：将格式化的 JSON 压缩为单行 / **Minify**: Compress to single line
- **缩进**：支持 2 空格、4 空格、Tab / **Indent**: 2 spaces, 4 spaces, Tab
- **实时校验**：输入时自动检测 JSON 语法，错误即时提示 / **Validation**: Real-time syntax check
- **转 CSV**：将 JSON 数组或对象转换为 CSV 格式 / **To CSV**: Convert JSON array/object to CSV
- **语法高亮**：输出区关键字、字符串、数字等彩色显示 / **Syntax highlight**: Colorized output
- **复制**：一键复制格式化结果 / **Copy**: One-click copy
- **下载**：直接下载 JSON 或 CSV 文件（CSV 含 UTF-8 BOM，Excel 友好）/ **Download**: JSON or CSV file (CSV with UTF-8 BOM, Excel-friendly)
- **深色模式**：默认深色主题 / **Dark mode**: Default dark theme
- **中英文切换** / **Chinese & English**

## 运行 / Development

```bash
npm install
npm run dev
```

访问 http://localhost:5173 / Visit http://localhost:5173

## 构建 / Build

```bash
npm run build
```

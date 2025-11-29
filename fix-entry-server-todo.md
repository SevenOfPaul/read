# 修复 app/entry.server.tsx 待办事项

## 任务目标
修复 `app/entry.server.tsx` 中的 `handleDataRequest` 函数，使其符合 React Router v7 和 Cloudflare Pages 的规范。

## 待办事项列表
- [x] 获取 React Router v7 服务器端处理正确文档
- [x] 分析当前错误的实现
- [x] 修正构建导入路径
- [x] 重写 app/entry.server.tsx 文件使用正确的 API
- [ ] 确保与 Cloudflare Pages 环境兼容
- [ ] 保持原有功能（设置自定义头部）
- [ ] 验证修复后的实现

## 项目信息
- 项目名称：夜读小说网
- 框架：React Router v7
- 环境：Cloudflare Pages
- 运行时：非 Node.js（Cloudflare Workers 兼容）

## 问题分析
1. ✅ 使用了错误的导入包（@remix-run/cloudflare 而不是 react-router）
2. ✅ 使用了错误的函数名和参数（handleDataRequest 不存在）
3. ✅ 上下文类型定义错误
4. ✅ 已修正：导入路径应为 `../build/server` 而不是 `virtual:react-router/server-build`

## 修复内容
- ✅ 使用正确的 react-router 导入
- ✅ 使用 createRequestHandler API
- ✅ 正确的 Cloudflare Pages 导出格式
- ✅ 正确的类型定义
- ✅ 修正构建导入路径
- ⏳ 需要添加自定义头部功能

# PR Changelog Workflow Commands

## 概述

PR Changelog 工作流现在支持通过评论指令手动触发重新运行检查，并且包含**合并限制机制**，确保版本变更必须有相应的 changelog 更新。

## ⚠️ 重要：合并限制

### 自动合并阻止
当检测到以下情况时，PR 将**无法合并**：
- 版本号发生变更但 changelog 工作流失败
- 版本号发生变更但 changelog 文件未正确更新
- changelog 工作流遇到错误

### 状态检查
系统会设置以下状态检查来控制 PR 合并：
- `pr-merge-gate`: 主要的合并门禁检查
- `changelog-update`: changelog 更新状态反馈

只有所有状态检查都通过，PR 才能被合并。

## 支持的触发方式

### 1. 自动触发
- 当 PR 被创建、同步或重新打开时
- 当 `package.json` 中的版本发生变化时

### 2. 手动触发（工作流调度）
- 在 Actions 页面手动运行工作流
- 需要输入 PR 编号

### 3. 评论指令触发 ⭐ 新增功能
在 PR 评论区使用以下任一指令可以触发重新生成 changelog：

- `/update-changelog`
- `/regenerate-changelog` 
- `/重新生成changelog`
- `/update changelog`
- `/更新changelog`

## 使用方法

### 通过评论触发
1. 在需要重新生成 changelog 的 PR 中添加评论
2. 在评论中包含上述任一触发指令
3. 工作流会自动启动并重新检查版本变更
4. 如果检测到版本变更，会重新生成 CHANGELOG.md
5. 工作流会在评论中反馈执行结果

### 反馈机制
- 收到指令时会在评论上添加 👍 反应表情
- 执行成功后会添加成功反馈评论
- 如果没有检测到版本变更，会添加相应说明评论

## 工作流程

1. **评论检查**: 检测评论是否包含触发指令
2. **版本检查**: 比较当前分支与主分支的 package.json 版本
3. **Changelog 提取**: 从 PR 描述中提取更新日志内容
4. **更新文件**: 更新 CHANGELOG.md 文件
5. **提交变更**: 提交 changelog 更新
6. **状态设置**: 设置 commit status 用于合并控制
7. **添加标签**: 为版本更新的 PR 添加标签
8. **反馈结果**: 在评论中提供执行结果反馈

## 合并控制机制

### 合并门禁 (`pr-merge-gate`)
- 自动检测版本变更
- 验证 changelog 工作流完成状态
- 设置 commit status 控制 PR 合并权限

### 失败场景
PR 将被阻止合并当：
- ❌ 版本变更但 changelog 工作流失败
- ❌ 版本变更但 changelog 文件未更新
- ❌ 工作流执行过程中出现错误

### 成功场景
PR 可以正常合并当：
- ✅ 无版本变更（不需要 changelog）
- ✅ 版本变更且 changelog 成功更新

## 注意事项

- 只有 PR 的评论才会触发工作流，普通 issue 的评论不会触发
- 指令不区分大小写，支持中英文
- **版本变更的 PR 必须成功更新 changelog 才能合并**
- 需要适当的 GitHub token 权限来执行相关操作
- 建议配置分支保护规则以强制执行状态检查

## 示例

在 PR 评论中输入：
```
/update-changelog
```

或者：
```
需要重新生成更新日志
/重新生成changelog
```

工作流会自动启动并处理请求。

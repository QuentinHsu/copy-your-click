# 快速设置指南：PR 合并限制机制

## 🚀 一键设置

按照以下步骤快速启用 PR 合并限制机制：

### 1. 工作流文件 (已完成 ✅)
- `pr-changelog.yml`: 主要的 changelog 更新工作流
- `pr-merge-gate.yml`: 合并门禁检查工作流

### 2. 配置分支保护规则 (需要手动设置)

#### 快速配置步骤：
1. 进入仓库 Settings → Branches
2. 点击 "Add rule" 或编辑 `main` 分支规则
3. 配置以下设置：

```
Branch name pattern: main

✅ Require a pull request before merging
✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging
  Status checks that are required:
    ✅ pr-merge-gate         <- 重要！必须勾选
    ✅ changelog-update      <- 可选，提供额外信息

✅ Require conversation resolution before merging
✅ Include administrators   <- 建议勾选，让管理员也遵守规则
❌ Allow force pushes      <- 禁用
❌ Allow deletions         <- 禁用
```

4. 点击 "Create" 或 "Save changes"

### 3. 验证设置

创建一个测试 PR：
1. 修改 `package.json` 中的版本号
2. 观察 PR 页面是否显示状态检查
3. 确认在 changelog 工作流完成前无法合并

## 🎯 预期效果

### ✅ 正常流程
```
1. PR 创建/更新 (版本变更)
2. pr-merge-gate 状态: pending ⏳
3. changelog 工作流自动运行
4. 工作流成功完成
5. pr-merge-gate 状态: success ✅
6. PR 可以合并
```

### ❌ 阻止合并的情况
```
1. 版本变更但 changelog 工作流失败
   → pr-merge-gate 状态: failure ❌
   → 合并按钮被禁用

2. 版本变更但没有运行 changelog 工作流
   → pr-merge-gate 状态: pending ⏳
   → 合并按钮被禁用
```

## 🛠️ 故障排除

### 问题：状态检查不出现
**原因**: 分支保护规则未正确配置
**解决**: 确保在分支保护规则中添加了 `pr-merge-gate` 状态检查

### 问题：始终显示 pending
**原因**: changelog 工作流未运行或失败
**解决**: 
1. 检查 Actions 页面的工作流状态
2. 使用评论指令手动触发: `/update-changelog`

### 问题：管理员也无法合并
**原因**: 勾选了 "Include administrators"
**解决**: 
- 临时取消勾选该选项，或
- 修复 changelog 问题后再合并

## 📝 使用指南

### 开发者操作
1. **创建 PR 时**: 在描述中包含 changelog 内容
2. **版本变更时**: 确保 changelog 工作流成功完成
3. **工作流失败时**: 使用 `/update-changelog` 指令重试

### 管理员操作
1. **配置分支保护**: 按照上述步骤设置规则
2. **紧急合并**: 可临时禁用分支保护规则
3. **监控合规**: 定期检查 PR 是否遵循 changelog 更新流程

## 🔧 自定义配置

### 调整检查范围
编辑 `pr-merge-gate.yml` 文件中的文件检查逻辑：
```yaml
# 检查是否修改了 package.json
const packageJsonChanged = files.some(file => file.filename === 'package.json');
```

### 修改状态检查名称
在 `pr-merge-gate.yml` 中修改：
```yaml
context: 'pr-merge-gate'  # 改为你想要的名称
```

然后在分支保护规则中使用新的名称。

### 添加更多检查
可以在 `pr-merge-gate.yml` 中添加额外的验证逻辑，例如：
- 检查特定文件的格式
- 验证提交信息格式
- 检查代码质量指标

## 📚 相关文档

- [WORKFLOW_COMMANDS.md](./WORKFLOW_COMMANDS.md): 详细的工作流指令说明
- [BRANCH_PROTECTION_GUIDE.md](./BRANCH_PROTECTION_GUIDE.md): 完整的分支保护配置指南
- [TEST_WORKFLOW_COMMANDS.md](./TEST_WORKFLOW_COMMANDS.md): 测试用例和验证步骤

## ✨ 总结

通过以上设置，你的仓库将具备：
- 🛡️ **自动合并保护**: 版本变更必须有 changelog
- 🔄 **灵活触发机制**: 支持评论指令手动重试
- 📊 **详细状态反馈**: 清晰的成功/失败状态显示
- 🚀 **无缝集成**: 与现有 PR 流程完美结合

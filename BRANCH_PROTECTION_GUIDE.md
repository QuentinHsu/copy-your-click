# 分支保护配置指南

## 概述

为了确保所有版本变更都有相应的 changelog 更新，我们实现了一套状态检查机制。当任何检查不通过时，PR 将无法合并。

## 状态检查说明

### 1. `pr-merge-gate` (主要检查)
- **目的**: 检查是否需要 changelog 更新，以及 changelog 是否正确更新
- **检查内容**:
  - 是否修改了 `package.json` 的版本号
  - 如果版本号变更，changelog 工作流是否成功完成
  - changelog 文件是否正确更新
- **状态**:
  - ✅ `success`: 无版本变更或版本变更且 changelog 已正确更新
  - ❌ `failure`: 版本变更但 changelog 未正确更新
  - ⏳ `pending`: 等待 changelog 工作流完成

### 2. `changelog-update` (辅助检查)
- **目的**: 反馈 changelog 更新过程的状态
- **检查内容**: changelog 工作流的执行结果
- **状态**: 提供详细的执行状态信息

## GitHub 分支保护规则配置

### 1. 访问分支保护设置
1. 进入仓库的 Settings 页面
2. 点击左侧菜单的 "Branches"
3. 在 "Branch protection rules" 区域点击 "Add rule" 或编辑现有规则

### 2. 配置保护规则
为 `main` 分支设置以下保护规则：

#### 基本设置
- **Branch name pattern**: `main`
- ✅ **Require a pull request before merging**
  - ✅ Require approvals (建议至少 1 个)
  - ✅ Dismiss stale reviews when new commits are pushed
  - ✅ Require review from code owners (如果有 CODEOWNERS 文件)

#### 状态检查 (关键配置)
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - **必需的状态检查**:
    - `pr-merge-gate` ⭐ **最重要的检查**
    - `changelog-update` (可选，提供额外信息)

#### 其他建议设置
- ✅ **Require conversation resolution before merging**
- ✅ **Include administrators** (让管理员也遵守规则)
- ✅ **Allow force pushes** - **取消勾选** (禁止强制推送)
- ✅ **Allow deletions** - **取消勾选** (禁止删除分支)

### 3. 验证配置
配置完成后，分支保护规则应该显示：
```
Protect this branch
✅ Require a pull request before merging
✅ Require status checks to pass before merging
   - pr-merge-gate ⭐
   - changelog-update (可选)
✅ Require conversation resolution before merging  
✅ Include administrators
❌ Allow force pushes
❌ Allow deletions
```

## 工作流程

### 正常版本更新流程
1. 开发者创建 PR，修改 `package.json` 版本号
2. PR 描述中包含 changelog 内容
3. `pr-merge-gate` 检测到版本变更，状态为 `pending`
4. `PR Changelog Update` 工作流自动运行
5. 工作流成功完成后，`pr-merge-gate` 状态变为 `success`
6. PR 可以正常合并

### 异常情况处理
1. **Changelog 工作流失败**:
   - `pr-merge-gate` 状态为 `failure`
   - PR 无法合并
   - 开发者需要修复问题并重新触发工作流

2. **忘记更新 changelog**:
   - 可以在 PR 评论中使用指令触发更新: `/update-changelog`
   - 或者编辑 PR 描述添加 changelog 内容后手动运行工作流

3. **紧急合并**:
   - 管理员可以临时禁用分支保护规则
   - 或者在分支保护设置中取消勾选 "Include administrators"

## 测试分支保护

### 测试步骤
1. 创建一个测试 PR，修改 `package.json` 版本号
2. 观察 PR 页面的状态检查
3. 尝试合并 PR (应该被阻止)
4. 等待 changelog 工作流完成
5. 再次尝试合并 (应该可以成功)

### 预期结果
- PR 页面显示 "Some checks haven't completed yet" 或 "Some checks were not successful"
- "Merge pull request" 按钮被禁用
- 状态检查区域显示相应的检查状态

## 故障排除

### 常见问题
1. **状态检查不出现**: 检查工作流文件是否正确配置和触发
2. **始终显示 pending**: 检查工作流是否正在运行或失败
3. **管理员无法合并**: 检查是否勾选了 "Include administrators"

### 调试方法
1. 查看 Actions 页面的工作流运行日志
2. 检查 commit 的状态检查 API 响应
3. 验证分支保护规则配置是否正确

## 注意事项

1. **首次配置**: 可能需要等待一个完整的 PR 周期才能看到状态检查
2. **权限要求**: 工作流需要适当的 GitHub token 权限来设置 commit status
3. **性能影响**: 状态检查会在每次 PR 更新时运行，注意工作流的执行时间
4. **绕过机制**: 管理员始终可以通过修改分支保护规则来绕过检查

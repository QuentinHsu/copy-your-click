<p align="center">
<img height="200" src="./assets/icon.png" alt="export what">
</p>


# Copy your click

[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/quentinhsu.copy-your-click?label=Visual%20Studio%20Marketplace&labelColor=374151&color=60a5fa)](https://marketplace.visualstudio.com/items?itemName=quentinhsu.copy-your-click)
![GitHub](https://img.shields.io/github/license/QuentinHsu/copy-your-click?label=License&labelColor=374151&color=60a5fa)


`Copy your click` 是一个简单实用的 VS Code 扩展，提供了快速复制文件名和文件夹名的功能，帮助开发者更高效地处理文件路径相关的任务。

## 功能

- **复制文件名**
  在资源管理器中右键点击文件，选择 `Copy File Name`，即可将文件名复制到剪贴板。

- **复制文件名（不带文件类型）**
  在资源管理器中右键点击文件，选择 `Copy File Name`，即可将不带文件后缀名的文件名复制到剪贴板。

- **复制文件夹名**
  在资源管理器中右键点击文件夹，选择 `Copy Folder Name`，即可将文件夹名复制到剪贴板。

## 使用方法

1. 打开 VS Code 的资源管理器。
2. 右键点击目标文件或文件夹。
3. 选择相应的命令：
   - `Copy File Name`：复制文件名。
   - `Copy File Name (No File Type)`：复制不带文件类型后缀名的文件名。
   - `Copy Folder Name`：复制文件夹名。
4. 文件名或文件夹名将被复制到剪贴板，并在右下角显示提示信息。

## 示例

- 复制文件名：
  如果选择的文件路径为 `/Users/quentin/work-space/code/example.txt`，执行 `Copy File Name` 后，剪贴板内容为 `example.txt`。

- 复制文件名（不带文件类型）：
  如果选择的文件路径为 `/Users/quentin/work-space/code/example.txt`，执行 `Copy File Name (No File Type)` 后，剪贴板内容为 `example`。

- 复制文件夹名：
  如果选择的文件夹路径为 `/Users/quentin/work-space/code/folder/`，执行 `Copy Folder Name` 后，剪贴板内容为 `folder`。

## 安装

1. 克隆或下载此项目到本地。
2. 在 VS Code 中打开项目文件夹。
3. 按 `F5` 启动扩展开发主机，测试扩展功能。

## 贡献

欢迎提交问题或功能请求！您可以通过 [GitHub Issues](https://github.com/QuentinHsu/copy-your-click/issues) 提交反馈。

import * as vscode from "vscode";
import * as path from "node:path";

export function registerDuplicateCommand(context: vscode.ExtensionContext) {
	const duplicateCommand = vscode.commands.registerCommand(
		"copy-your-click.duplicate",
		async (uri: vscode.Uri) => {
			if (!uri || !uri.fsPath) {
				vscode.window.showErrorMessage("❌ No file or folder selected.");
				return;
			}

			try {
				const originalPath = uri.fsPath;
				const parentDir = path.dirname(originalPath);
				const originalName = path.basename(originalPath);
				const parsedPath = path.parse(originalPath);
				const originalNameWithoutExt = parsedPath.name;
				const originalExt = parsedPath.ext; // Includes the dot, e.g., ".ts"

				// 建议的新名称
				const suggestedName = `${originalNameWithoutExt} Copy${originalExt}`;

				// 提示用户输入新名称
				const newName = await vscode.window.showInputBox({
					prompt: "Enter the name for the duplicate",
					value: suggestedName,
					valueSelection: [0, originalNameWithoutExt.length + 5], // Select "Name Copy" part
				});

				if (!newName) {
					// 用户取消了输入
					return;
				}

				const targetPath = path.join(parentDir, newName);
				const targetUri = vscode.Uri.file(targetPath);

				// 检查目标是否已存在
				try {
					await vscode.workspace.fs.stat(targetUri);
					vscode.window.showErrorMessage(
						`❌ "${newName}" already exists in this location.`,
					);
					return; // 如果已存在，则停止操作
				} catch {
					// 文件或文件夹不存在，可以继续
				}

				// 执行复制
				await vscode.workspace.fs.copy(uri, targetUri, { overwrite: false });

				vscode.window.showInformationMessage(
					`✅ Duplicated "${originalName}" as "${newName}"`,
				);

				// 检查复制的目标是文件还是文件夹
				const targetStat = await vscode.workspace.fs.stat(targetUri);
				
				if (targetStat.type === vscode.FileType.File) {
					// 如果是文件，直接在编辑器中打开
					await vscode.window.showTextDocument(targetUri);
				} else if (targetStat.type === vscode.FileType.Directory) {
					// 如果是文件夹，尝试平滑地显示和展开
					try {
						// 直接在资源管理器中显示文件夹，无需刷新
						await vscode.commands.executeCommand('revealInExplorer', targetUri);
						
						// 使用较短的延迟，减少抖动
						await new Promise(resolve => setTimeout(resolve, 50));
						
						// 只使用最有效的展开方法
						try {
							await vscode.commands.executeCommand('list.expand');
						} catch {
							// 如果展开失败，静默处理，至少文件夹已被选中
						}
						
					} catch (revealError) {
						// 如果reveal失败，尝试刷新后再试一次
						try {
							await vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
							await new Promise(resolve => setTimeout(resolve, 50));
							await vscode.commands.executeCommand('revealInExplorer', targetUri);
						} catch {
							// 最后的备选方案：只聚焦文件浏览器
							await vscode.commands.executeCommand('workbench.files.action.focusFilesExplorer');
						}
					}
				}
			} catch (error) {
				vscode.window.showErrorMessage(
					`❌ Failed to duplicate: ${(error as Error).message}`,
				);
			}
		},
	);

	context.subscriptions.push(duplicateCommand);
}

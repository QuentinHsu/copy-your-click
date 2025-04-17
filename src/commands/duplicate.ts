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

				// 尝试让新文件/文件夹在资源管理器中显示并准备重命名
				// 注意：这不保证一定能让其进入编辑状态，但会尝试选中它
				// 更好的方法是直接使用用户输入的名字创建，如上所示。
				// 如果仍想尝试触发编辑状态，可以取消下面这行注释，但这可能不可靠。
				// await vscode.commands.executeCommand('revealInExplorer', targetUri);
				// await vscode.commands.executeCommand('workbench.files.action.rename');
			} catch (error) {
				vscode.window.showErrorMessage(
					`❌ Failed to duplicate: ${(error as Error).message}`,
				);
			}
		},
	);

	context.subscriptions.push(duplicateCommand);
}

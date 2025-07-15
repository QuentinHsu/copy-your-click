import * as vscode from "vscode";
import * as path from "node:path";

export function registerDuplicateCommand(context: vscode.ExtensionContext) {
	const duplicateCommand = vscode.commands.registerCommand(
		"copy-your-click.duplicate",
		async (uri: vscode.Uri) => {
			await duplicateFile(uri, false);
		},
	);

	const duplicateWithPathCommand = vscode.commands.registerCommand(
		"copy-your-click.duplicateWithPath",
		async (uri: vscode.Uri) => {
			await duplicateFile(uri, true);
		},
	);

	context.subscriptions.push(duplicateCommand, duplicateWithPathCommand);
}

interface FolderPickItem extends vscode.QuickPickItem {
	isDirectory?: boolean;
	isBack?: boolean;
	isSelect?: boolean;
	fsPath?: string;
}

async function showInteractiveFolderPicker(initialPath: string): Promise<string | undefined> {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		vscode.window.showErrorMessage("❌ No workspace folder is open.");
		return undefined;
	}

	// 使用第一个工作区文件夹作为根目录
	const workspaceRoot = workspaceFolders[0].uri.fsPath;
	let currentPath = workspaceRoot;

	// 如果初始路径在工作区内，使用它作为起始点
	if (initialPath.startsWith(workspaceRoot)) {
		currentPath = path.dirname(initialPath);
	}

	while (true) {
		const items: FolderPickItem[] = [];
		
		// 显示当前路径相对于工作区根目录的位置
		const relativePath = path.relative(workspaceRoot, currentPath);
		const displayPath = relativePath || 'Workspace Root';
		
		// 添加"选择当前文件夹"选项
		items.push({
			label: "$(check) Select this folder",
			description: displayPath,
			detail: `Use current folder: ${currentPath}`,
			isSelect: true,
			fsPath: currentPath,
		});

		// 添加"跳转到源文件所在目录"选项（如果不在源目录）
		const sourceDir = path.dirname(initialPath);
		if (sourceDir !== currentPath && sourceDir.startsWith(workspaceRoot)) {
			const sourceRelativePath = path.relative(workspaceRoot, sourceDir);
			const sourceDisplayPath = sourceRelativePath || 'Workspace Root';
			
			items.push({
				label: "$(file-directory) Go to source directory",
				description: sourceDisplayPath,
				detail: `Jump to source file's directory`,
				isDirectory: true,
				fsPath: sourceDir,
			});
		}

		// 添加"返回上级"选项（除非已经在工作区根目录）
		if (currentPath !== workspaceRoot) {
			const parentPath = path.dirname(currentPath);
			const parentRelativePath = path.relative(workspaceRoot, parentPath);
			const parentDisplayPath = parentRelativePath || 'Workspace Root';
			
			items.push({
				label: "$(arrow-up) Go back",
				description: parentDisplayPath,
				detail: `Go to parent directory`,
				isBack: true,
				fsPath: parentPath,
			});
		}

		// 添加分隔符
		items.push({
			label: "",
			kind: vscode.QuickPickItemKind.Separator,
		});

		try {
			// 读取当前目录的子文件夹
			const currentUri = vscode.Uri.file(currentPath);
			const entries = await vscode.workspace.fs.readDirectory(currentUri);
			
			const directories = entries
				.filter(([name, type]) => {
					// 过滤掉隐藏文件夹和常见的构建/依赖文件夹
					if (name.startsWith('.')) return false;
					if (['node_modules', 'out', 'dist', 'build', '.git'].includes(name)) return false;
					return type === vscode.FileType.Directory;
				})
				.sort(([a], [b]) => a.localeCompare(b));

			for (const [name] of directories) {
				const fullPath = path.join(currentPath, name);
				const folderRelativePath = path.relative(workspaceRoot, fullPath);
				
				items.push({
					label: `$(folder) ${name}`,
					description: folderRelativePath,
					detail: `Enter folder: ${name}`,
					isDirectory: true,
					fsPath: fullPath,
				});
			}

			if (directories.length === 0) {
				items.push({
					label: "$(info) No subfolders",
					description: "This folder contains no accessible subfolders",
					detail: "",
				});
			}

		} catch (error) {
			items.push({
				label: "$(error) Cannot read directory",
				description: "Permission denied or directory doesn't exist",
				detail: (error as Error).message,
			});
		}

		const selectedItem = await vscode.window.showQuickPick(items, {
			placeHolder: `Select destination folder (Currently in: ${displayPath})`,
			matchOnDescription: true,
			matchOnDetail: true,
		});

		if (!selectedItem) {
			// 用户取消了选择
			return undefined;
		}

		if (selectedItem.isSelect) {
			// 用户选择了当前文件夹
			return selectedItem.fsPath;
		}

		if (selectedItem.isBack || selectedItem.isDirectory) {
			// 用户选择了返回上级或进入子文件夹
			currentPath = selectedItem.fsPath!;
			continue;
		}

		// 其他情况，继续循环
	}
}

async function duplicateFile(uri: vscode.Uri, allowCustomPath: boolean) {
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

		let targetDir = parentDir;

		// 如果启用了自定义路径选择功能
		if (allowCustomPath) {
			const pathChoice = await vscode.window.showQuickPick(
				[
					{
						label: "$(folder) Same directory",
						description: parentDir,
						detail: "Keep the file in the same directory as the original",
						isDefault: true,
					},
					{
						label: "$(folder-opened) Choose different directory",
						description: "Select a custom location",
						detail: "Browse and select a different directory",
						isCustom: true,
					},
				],
				{
					placeHolder: "Choose where to save the duplicate",
					matchOnDescription: true,
				}
			);

			if (!pathChoice) {
				// 用户取消了选择
				return;
			}

			if (pathChoice.isCustom) {
				// 使用交互式的文件夹选择器
				const selectedPath = await showInteractiveFolderPicker(parentDir);
				if (!selectedPath) {
					return;
				}
				targetDir = selectedPath;
			}
		}

		const targetPath = path.join(targetDir, newName);
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

		// 显示成功消息，包含目标目录信息
		const targetDirName = path.basename(targetDir);
		const successMessage = targetDir === parentDir 
			? `✅ Duplicated "${originalName}" as "${newName}"`
			: `✅ Duplicated "${originalName}" as "${newName}" in "${targetDirName}"`;
		
		vscode.window.showInformationMessage(successMessage);

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
}

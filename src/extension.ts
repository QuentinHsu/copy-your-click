import * as vscode from "vscode";
import * as path from "node:path";
import { convertCase } from "./utils/caseConverter";
import type { CaseType } from "./utils/caseConverter";

export function activate(context: vscode.ExtensionContext) {
	// 处理文件名复制
	const copyFileNameCommand = vscode.commands.registerCommand(
		"copy—your-click.copyFileName",
		async (uri: vscode.Uri) => {
			if (uri) {
				const fileName = path.basename(uri.fsPath);
				if (fileName) {
					await vscode.env.clipboard.writeText(fileName);
					vscode.window.showInformationMessage(`📄 Copied: "${fileName}"`);
				}
			} else {
				vscode.window.showErrorMessage("📄 No file selected.");
			}
		},
	);

	const copyFileNameNoFileTypeCommand = vscode.commands.registerCommand(
		"copy—your-click.copyFileNameNoFileType",
		async (uri: vscode.Uri) => {
			if (uri) {
				const fileName = path.basename(uri.fsPath);
				if (fileName) {
					const fileNameNoExt = path.parse(fileName).name;
					await vscode.env.clipboard.writeText(fileNameNoExt);
					vscode.window.showInformationMessage(`📄 Copied: "${fileNameNoExt}"`);
				}
			} else {
				vscode.window.showErrorMessage("📄 No file selected.");
			}
		},
	);

	// 处理文件夹名复制
	const copyFolderNameCommand = vscode.commands.registerCommand(
		"copy—your-click.copyFolderName",
		async (uri: vscode.Uri) => {
			try {
				if (!uri || !uri.fsPath) {
					vscode.window.showErrorMessage("📁 No folder selected.");
					return;
				}

				const folderName = path.basename(uri.fsPath);
				if (!folderName) {
					vscode.window.showErrorMessage(
						"📁 Folder name could not be determined.",
					);
					return;
				}

				await vscode.env.clipboard.writeText(folderName);
				vscode.window.showInformationMessage(`📁 Copied: "${folderName}"`);
			} catch (error) {
				vscode.window.showErrorMessage(
					`📁 Failed to copy folder name: ${(error as Error).message}`,
				);
			}
		},
	);

	// 添加文件名大小写转换功能
	const copyWithCaseCommands = [
		{ type: "changeCase", commandId: "copyAsCamelCase", title: "camelCase" },
		{ type: "ChangeCase", commandId: "copyAsPascalCase", title: "PascalCase" },
		{ type: "change_case", commandId: "copyAsSnakeCase", title: "snake_case" },
		{ type: "change-case", commandId: "copyAsKebabCase", title: "kebab-case" },
		{
			type: "CHANGE_CASE",
			commandId: "copyAsUpperSnakeCase",
			title: "UPPER_SNAKE_CASE",
		},
		{
			type: "change case",
			commandId: "copyAsLowerSpace",
			title: "lower space",
		},
		{
			type: "CHANGE CASE",
			commandId: "copyAsUpperSpace",
			title: "UPPER SPACE",
		},
		{ type: "Change Case", commandId: "copyAsTitleCase", title: "Title Case" },
		{
			type: "Change case",
			commandId: "copyAsSentenceCase",
			title: "Sentence case",
		},
		{ type: "change.case", commandId: "copyAsDotCase", title: "dot.case" },
	].map(({ type, commandId, title }) => {
		return vscode.commands.registerCommand(
			`copy—your-click.${commandId}`,
			async (uri: vscode.Uri) => {
				if (uri) {
					const fileName = path.basename(uri.fsPath);
					if (fileName) {
						// 获取不带扩展名的文件名
						const nameWithoutExt = path.parse(fileName).name;
						const convertedName = convertCase(nameWithoutExt, type as CaseType);
						await vscode.env.clipboard.writeText(convertedName);
						vscode.window.showInformationMessage(
							`📄 Copied as ${title}: "${convertedName}"`,
						);
					} else {
						vscode.window.showErrorMessage("📄 No file selected.");
					}
				}
			},
		);
	});

	// --- 新增 Duplicate 功能 ---
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
	// --- 结束新增 Duplicate 功能 ---

	context.subscriptions.push(copyFileNameCommand);
	context.subscriptions.push(copyFileNameNoFileTypeCommand);
	context.subscriptions.push(copyFolderNameCommand);
	context.subscriptions.push(...copyWithCaseCommands);
	context.subscriptions.push(duplicateCommand); // 注册新命令
}

export function deactivate() {}

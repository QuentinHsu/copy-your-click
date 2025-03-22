import * as vscode from "vscode";
import * as path from "node:path";

export function activate(context: vscode.ExtensionContext) {
	// 处理文件名复制
	const copyFileNameCommand = vscode.commands.registerCommand(
		"copy—your-click.copyFileName",
		async (uri: vscode.Uri) => {
			if (uri) {
				const fileName = uri.fsPath.split("/").pop() || null;
				if (fileName) {
					await vscode.env.clipboard.writeText(fileName);
				}
				vscode.window.showInformationMessage(`📄 Copied: "${fileName}"`);
			} else {
				vscode.window.showErrorMessage("📄 No file selected.");
			}
		},
	);
	const copyFileNameNoFileTyeCommand = vscode.commands.registerCommand(
		"copy—your-click.copyFileNameNoFileType",
		async (uri: vscode.Uri) => {
			if (uri) {
				const fileName = uri.fsPath.split("/").pop() || null;
				if (fileName) {
					const fileNameNoFileType = fileName.split(".")[0];
					await vscode.env.clipboard.writeText(fileNameNoFileType);
					vscode.window.showInformationMessage(
						`📄 Copied: "${fileNameNoFileType}"`,
					);
				} else {
					vscode.window.showErrorMessage("📄 No file selected.");
				}
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

				const folderPath = uri.fsPath;
				const folderName = path.basename(folderPath);

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

	context.subscriptions.push(copyFileNameCommand);
	context.subscriptions.push(copyFileNameNoFileTyeCommand);
	context.subscriptions.push(copyFolderNameCommand);
}

export function deactivate() {}

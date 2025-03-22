import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	// 处理文件名复制
	const copyFileNameCommand = vscode.commands.registerCommand(
		"extension.copyFileName",
		async (uri: vscode.Uri) => {
			if (uri) {
				const fileName = uri.fsPath.split("/").pop() || null;
				if (fileName) {
					await vscode.env.clipboard.writeText(fileName);
				}
				vscode.window.showInformationMessage(
					`Copied: ${fileName ?? "Unknown"}`,
				);
			}
		},
	);

	// 处理文件夹名复制
	const copyFolderNameCommand = vscode.commands.registerCommand(
		"extension.copyFolderName",
		async (uri: vscode.Uri) => {
			if (uri) {
				const folderName = uri.fsPath.split("/").pop();
				if (folderName) {
					await vscode.env.clipboard.writeText(folderName);
					vscode.window.showInformationMessage(`Copied: ${folderName}`);
				} else {
					vscode.window.showInformationMessage("No folder name found.");
				}
			}
		},
	);

	context.subscriptions.push(copyFileNameCommand);
	context.subscriptions.push(copyFolderNameCommand);
}

export function deactivate() {}

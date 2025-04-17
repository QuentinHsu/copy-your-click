import * as vscode from "vscode";
import * as path from "node:path";

export function registerCopyFileNameCommands(context: vscode.ExtensionContext) {
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

	context.subscriptions.push(
		copyFileNameCommand,
		copyFileNameNoFileTypeCommand,
	);
}

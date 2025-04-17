import * as vscode from "vscode";
import * as path from "node:path";

export function registerCopyFolderNameCommand(
	context: vscode.ExtensionContext,
) {
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

	context.subscriptions.push(copyFolderNameCommand);
}

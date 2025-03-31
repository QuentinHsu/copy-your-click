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

	context.subscriptions.push(copyFileNameCommand);
	context.subscriptions.push(copyFileNameNoFileTypeCommand);
	context.subscriptions.push(copyFolderNameCommand);
	context.subscriptions.push(...copyWithCaseCommands);
}

export function deactivate() {}

import * as vscode from "vscode";
import * as path from "node:path";
import { convertCase, type CaseType } from "../utils/caseConverter";

export function registerCopyCaseCommands(context: vscode.ExtensionContext) {
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

	context.subscriptions.push(...copyWithCaseCommands);
}

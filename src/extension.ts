import type * as vscode from "vscode";
import { registerCopyFileNameCommands } from "./commands/copyFileName";
import { registerCopyFolderNameCommand } from "./commands/copyFolderName";
import { registerCopyCaseCommands } from "./commands/copyCaseCommands";
import { registerDuplicateCommand } from "./commands/duplicate";

export function activate(context: vscode.ExtensionContext) {
	// 注册来自不同模块的命令
	registerCopyFileNameCommands(context);
	registerCopyFolderNameCommand(context);
	registerCopyCaseCommands(context);
	registerDuplicateCommand(context);
}

export function deactivate() {}

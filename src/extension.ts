import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // 处理文件名复制
    let copyFileNameCommand = vscode.commands.registerCommand('extension.copyFileName', async (uri: vscode.Uri) => {
        if (uri) {
            await vscode.env.clipboard.writeText(uri.fsPath.split('/').pop()!);
            vscode.window.showInformationMessage(`Copied: ${uri.fsPath.split('/').pop()!}`);
        }
    });

    // 处理文件夹名复制
    let copyFolderNameCommand = vscode.commands.registerCommand('extension.copyFolderName', async (uri: vscode.Uri) => {
        if (uri) {
            await vscode.env.clipboard.writeText(uri.fsPath.split('/').pop()!);
            vscode.window.showInformationMessage(`Copied: ${uri.fsPath.split('/').pop()!}`);
        }
    });

    context.subscriptions.push(copyFileNameCommand);
    context.subscriptions.push(copyFolderNameCommand);
}

export function deactivate() {}
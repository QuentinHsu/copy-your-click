import * as assert from "node:assert";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
	vscode.window.showInformationMessage("Start all tests.");

	test("Sample test", () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
		test("Copy folder name command", async () => {
			const mockUri = vscode.Uri.file("/Users/quentin/work-space/code/folder/");
			await vscode.commands.executeCommand(
				"copy—your-click.copyFolderName",
				mockUri,
			);

			const clipboardContent = await vscode.env.clipboard.readText();
			assert.strictEqual(
				clipboardContent,
				"folder",
				"Folder name should be copied to clipboard",
			);
		});

		test("Copy file name with special characters", async () => {
			const mockUri = vscode.Uri.file(
				"/Users/quentin/work-space/code/special@file!.txt",
			);
			await vscode.commands.executeCommand(
				"copy—your-click.copyFileName",
				mockUri,
			);

			const clipboardContent = await vscode.env.clipboard.readText();
			assert.strictEqual(
				clipboardContent,
				"special@file!.txt",
				"File name with special characters should be copied to clipboard",
			);
		});

		test("Copy folder name with special characters", async () => {
			const mockUri = vscode.Uri.file(
				"/Users/quentin/work-space/code/special@folder!/",
			);
			await vscode.commands.executeCommand(
				"copy—your-click.copyFolderName",
				mockUri,
			);

			const clipboardContent = await vscode.env.clipboard.readText();
			assert.strictEqual(
				clipboardContent,
				"special@folder!",
				"Folder name with special characters should be copied to clipboard",
			);
		});

		test("Copy file name from deeply nested path", async () => {
			const mockUri = vscode.Uri.file(
				"/Users/quentin/work-space/code/deeply/nested/path/file.txt",
			);
			await vscode.commands.executeCommand(
				"copy—your-click.copyFileName",
				mockUri,
			);

			const clipboardContent = await vscode.env.clipboard.readText();
			assert.strictEqual(
				clipboardContent,
				"file.txt",
				"File name from deeply nested path should be copied to clipboard",
			);
		});

		test("Copy folder name from deeply nested path", async () => {
			const mockUri = vscode.Uri.file(
				"/Users/quentin/work-space/code/deeply/nested/path/folder/",
			);
			await vscode.commands.executeCommand(
				"copy—your-click.copyFolderName",
				mockUri,
			);

			const clipboardContent = await vscode.env.clipboard.readText();
			assert.strictEqual(
				clipboardContent,
				"folder",
				"Folder name from deeply nested path should be copied to clipboard",
			);
		});
	});

	test("Handle missing file name gracefully", async () => {
		const mockUri = vscode.Uri.file("./extension.test.ts");
		await vscode.commands.executeCommand(
			"copy—your-click.copyFileName",
			mockUri,
		);

		const clipboardContent = await vscode.env.clipboard.readText();
		assert.strictEqual(
			clipboardContent,
			"extension.test.ts",
			"Clipboard should be empty if no file name is found",
		);
	});

	test("Handle missing folder name gracefully", async () => {
		const mockUri = vscode.Uri.file("/");
		await vscode.commands.executeCommand(
			"copy—your-click.copyFolderName",
			mockUri,
		);

		const clipboardContent = await vscode.env.clipboard.readText();
		assert.strictEqual(
			clipboardContent,
			"extension.test.ts",
			"Clipboard should be empty if no folder name is found",
		);
	});
});

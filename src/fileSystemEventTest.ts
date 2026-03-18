// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { createRandomFile } from "./utils";

/**
 * 激活文件系统事件测试
 * 注册各种文件系统事件监听器，用于测试文件操作
 * @param context 扩展上下文
 */
export async function activateFileSystemEventTest(context: vscode.ExtensionContext) {
  // 创建测试文件
  const baseFile = await createRandomFile();
  await vscode.workspace.openTextDocument(baseFile);

  // 注册文件创建前事件监听器
  const willCreateFilesListener = vscode.workspace.onWillCreateFiles((event) => {
    console.log(`onWillCreateFiles: ${event.files}`);
    const workspaceEdit = new vscode.WorkspaceEdit();
    const newUri = baseFile.with({ path: baseFile.path + "-foo" });
    workspaceEdit.insert(baseFile, new vscode.Position(0, 0), "HALLO_NEW");
    event.waitUntil(Promise.resolve(workspaceEdit));
  });

  // 注册文件创建后事件监听器
  const didCreateFilesListener = vscode.workspace.onDidCreateFiles((event) => {
    console.log(`onDidCreateFiles: ${event}`);
  });

  // 注册文件删除前事件监听器
  const willDeleteFilesListener = vscode.workspace.onWillDeleteFiles((event) => {
    console.log(`onWillDeleteFiles: ${event}`);
    const workspaceEdit = new vscode.WorkspaceEdit();
    const newUri = baseFile.with({ path: baseFile.path + "-foo2" });
    workspaceEdit.createFile(newUri);
    workspaceEdit.insert(newUri, new vscode.Position(0, 0), "hahah");
    event.waitUntil(Promise.resolve(workspaceEdit));
  });

  // 注册文件删除后事件监听器
  const didDeleteFilesListener = vscode.workspace.onDidDeleteFiles((event) => {
    console.log(`onDidDeleteFiles: ${event}`);
  });

  // 注册文件重命名前事件监听器
  const willRenameFilesListener = vscode.workspace.onWillRenameFiles((event) => {
    console.log(`onWillRenameFiles: ${event}`);
  });

  // 注册文件重命名后事件监听器
  const didRenameFilesListener = vscode.workspace.onDidRenameFiles(async (event) => {
    console.log(`onDidRenameFiles: ${event}`);
    const file = event.files[0].newUri;
    const stat = await vscode.workspace.fs.stat(file);
    if (stat.type === vscode.FileType.Directory) {
      const entries = await vscode.workspace.fs.readDirectory(file);
      console.log(entries);
    }
  });

  // 注册所有监听器到上下文
  context.subscriptions.push(
    willCreateFilesListener,
    didCreateFilesListener,
    willDeleteFilesListener,
    didDeleteFilesListener,
    willRenameFilesListener,
    didRenameFilesListener
  );
}

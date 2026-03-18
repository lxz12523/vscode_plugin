// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { activateVisibleRangeDemo } from "./visibleRangeDemo";
import { activateFileSystemEventTest } from "./fileSystemEventTest";

/**
 * 扩展激活函数
 * 当扩展被激活时调用，通常是在用户首次执行扩展命令时
 * @param context 扩展上下文
 */
export function activate(context: vscode.ExtensionContext) {
  // 注册 Hello World 命令
  const helloWorldCommand = vscode.commands.registerCommand(
    "vscode-plugin.helloWorld",
    () => {
      // 显示 Hello World 消息
      vscode.window.showInformationMessage("Hello World!");
    }
  );

  // 注册命令到上下文，以便在扩展禁用时自动释放
  context.subscriptions.push(helloWorldCommand);

  // 激活文件系统事件测试
  activateFileSystemEventTest(context);

  // 激活可见范围监听演示
  activateVisibleRangeDemo(context);
}



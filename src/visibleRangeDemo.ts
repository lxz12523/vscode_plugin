/*---------------------------------------------------------------------------------------------*
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

/**
 * 可见范围变化监听示例
 * 
 * 此文件演示了如何使用 vscode.TextEditor 的 visibleRanges 属性和以下事件
 * 来监听编辑器视口的变化，并根据可见范围执行相应的操作：
 * 1. vscode.window.onDidChangeVisibleTextEditors - 监听可见编辑器集合的变化
 * 2. vscode.window.onDidChangeEditorVisibleRanges - 监听编辑器可见范围的变化
 */

export function activateVisibleRangeDemo(context: vscode.ExtensionContext) {
    // 注册命令，用于启动可见范围监听
    const disposable = vscode.commands.registerCommand('vscode-plugin.visibleRangeDemo', () => {
        // 获取当前活动编辑器
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('请打开一个编辑器后再运行此命令');
            return;
        }

        // 显示当前可见范围信息
        showCurrentVisibleRange(editor);

        // 监听可见文本编辑器变化事件
        const visibleTextEditorsDisposable = vscode.window.onDidChangeVisibleTextEditors((editors) => {
            // 当可见编辑器发生变化时，检查当前活动编辑器
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                // 显示当前可见范围信息
                showCurrentVisibleRange(activeEditor);
            }
        });

        // 监听编辑器可见范围变化事件
        let visibleRangesDisposable: vscode.Disposable | undefined;
        if ('onDidChangeEditorVisibleRanges' in vscode.window) {
            visibleRangesDisposable = (vscode.window as any).onDidChangeEditorVisibleRanges((event: any) => {
                // 当可见范围发生变化时，更新显示信息
                showCurrentVisibleRange(event.textEditor);
            });
        }

        // 注册命令，用于停止监听
        const stopDisposable = vscode.commands.registerCommand('vscode-plugin.stopVisibleRangeDemo', () => {
            visibleTextEditorsDisposable.dispose();
            if (visibleRangesDisposable) {
                visibleRangesDisposable.dispose();
            }
            stopDisposable.dispose();
            vscode.window.showInformationMessage('已停止可见范围监听');
        });

        // 将 disposable 添加到 context 中，以便在扩展禁用时自动释放
        context.subscriptions.push(visibleTextEditorsDisposable);
        if (visibleRangesDisposable) {
            context.subscriptions.push(visibleRangesDisposable);
        }
        context.subscriptions.push(stopDisposable);

        vscode.window.showInformationMessage('已启动可见范围监听，请尝试滚动编辑器或调整窗口大小');
    });

    // 注册命令到 context
    context.subscriptions.push(disposable);
}

/**
 * 显示当前编辑器的可见范围信息
 * @param editor 当前活动的文本编辑器
 */
function showCurrentVisibleRange(editor: vscode.TextEditor) {
    // 获取当前可见范围数组
    const visibleRanges = editor.visibleRanges;
    
    // 计算总可见行数
    let totalVisibleLines = 0;
    visibleRanges.forEach(range => {
        totalVisibleLines += range.end.line - range.start.line + 1;
    });
    
    // 如果有可见范围
    if (visibleRanges.length > 0) {
        // 获取第一个可见范围
        const firstRange = visibleRanges[0];
        const startLine = firstRange.start.line;
        const endLine = firstRange.end.line;
        
        // 显示可见范围信息
        vscode.window.showInformationMessage(
            `当前可见范围: 从第 ${startLine + 1} 行到第 ${endLine + 1} 行，共 ${totalVisibleLines} 行`
        );
        
        // 在控制台输出详细信息
        console.log('当前可见范围:', {
            ranges: visibleRanges.map((range, index) => ({
                index,
                start: {
                    line: range.start.line,
                    character: range.start.character
                },
                end: {
                    line: range.end.line,
                    character: range.end.character
                }
            })),
            totalVisibleLines
        });
    }
}


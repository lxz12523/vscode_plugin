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

/**
 * 可见范围变化监听器类
 */
class VisibleRangeListener {
    private disposables: vscode.Disposable[] = [];

    /**
     * 启动可见范围监听
     * @param context 扩展上下文
     */
    start(context: vscode.ExtensionContext): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('请打开一个编辑器后再运行此命令');
            return;
        }

        // 显示当前可见范围信息
        this.showCurrentVisibleRange(editor);

        // 监听可见文本编辑器变化事件
        const visibleTextEditorsDisposable = vscode.window.onDidChangeVisibleTextEditors((editors) => {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                this.showCurrentVisibleRange(activeEditor);
            }
        });
        this.disposables.push(visibleTextEditorsDisposable);

        // 监听编辑器可见范围变化事件
        this.setupVisibleRangeChangeListener();

        // 注册命令，用于停止监听
        const stopDisposable = vscode.commands.registerCommand('vscode-plugin.stopVisibleRangeDemo', () => {
            this.dispose();
            vscode.window.showInformationMessage('已停止可见范围监听');
        });
        this.disposables.push(stopDisposable);

        // 将所有 disposable 添加到 context 中
        context.subscriptions.push(...this.disposables);

        vscode.window.showInformationMessage('已启动可见范围监听，请尝试滚动编辑器或调整窗口大小');
    }

    /**
     * 设置可见范围变化监听器
     */
    private setupVisibleRangeChangeListener(): void {
        // 使用 vscode.window.onDidChangeTextEditorVisibleRanges 监听编辑器可见范围变化
        const disposable = vscode.window.onDidChangeTextEditorVisibleRanges((event) => {
            this.showCurrentVisibleRange(event.textEditor);
        });
        this.disposables.push(disposable);
    }

    /**
     * 显示当前编辑器的可见范围信息
     * @param editor 当前活动的文本编辑器
     */
    private showCurrentVisibleRange(editor: vscode.TextEditor): void {
        try {
            // 获取当前可见范围数组
            const visibleRanges = editor.visibleRanges;
            
            // 计算总可见行数
            const totalVisibleLines = visibleRanges.reduce((sum, range) => {
                return sum + (range.end.line - range.start.line + 1);
            }, 0);
            
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
                    file: editor.document.fileName,
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
        } catch (error) {
            console.error('显示可见范围信息时出错:', error);
            vscode.window.showErrorMessage('显示可见范围信息时出错');
        }
    }

    /**
     * 释放所有资源
     */
    private dispose(): void {
        vscode.Disposable.from(...this.disposables).dispose();
        this.disposables = [];
    }
}

export function activateVisibleRangeDemo(context: vscode.ExtensionContext) {
    // 注册命令，用于启动可见范围监听
    const disposable = vscode.commands.registerCommand('vscode-plugin.visibleRangeDemo', () => {
        const listener = new VisibleRangeListener();
        listener.start(context);
    });

    // 注册命令到 context
    context.subscriptions.push(disposable);
}


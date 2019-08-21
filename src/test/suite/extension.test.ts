import * as assert from 'assert';
import { before } from 'mocha';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	before(() => {
		vscode.window.showInformationMessage('Start all tests.');
	});

 
	test('Sample test', async () => {
    await vscode.commands.executeCommand('findCrate');
	});
});

/*****************************************************************************
 *
 *  PROJECT:        VkCloneManager
 *  LICENSE:        See LICENSE in the top level directory
 *  FILE:           app.js
 *  DESCRIPTION:    Main
 *  COPYRIGHT:      (c) 2021 RINWARES <rinwares.com>
 *  DEVELOPER:      Rinat Namazov <rinat.namazov@rinwares.com>
 *
 *****************************************************************************/

"use strict";

const path = require("path");
const fs = require("fs").promises;
const inquirer = require("inquirer");
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const VkCloneManager = require("./VkCloneManager");

function getModuleChoices(vkCloneManager) {
	let moduleChoices = vkCloneManager.getModulesList();
	moduleChoices.unshift(new inquirer.Separator(), "exit", "reload", new inquirer.Separator());
	return moduleChoices;
}

async function reloadModuleCommand(vkCloneManager) {
	let moduleChoices = vkCloneManager.getModulesList();
	moduleChoices.unshift(new inquirer.Separator(), "all", new inquirer.Separator());

	const { moduleName } = await inquirer.prompt({
		type: "list",
		name: "moduleName",
		message: "What module do you want to reload?",
		choices: moduleChoices
	});

	if (moduleName == "all") {
		await vkCloneManager.reloadAllModules();
	} else {
		await vkCloneManager.reloadModule(moduleName);
	}
}

async function main() {
	let configPath;
	if (typeof(argv.config) === "string" && argv.config !== "") {
		configPath = argv.config;
	} else {
		configPath = path.join(__dirname, "config.js");
	}

	let config;
	try {
		config = require(configPath);
	} catch (e) {
		console.log(`Failed to load config: '${configPath}'.`, e);
		return;
	}

	let validConfig = false;
	if (config.accounts && config.accounts.length > 0) {
		const account = config.accounts[0];
		if (account.username != "" && account.password != "") {
			validConfig = true;
		}
	}
	if (!validConfig) {
		console.log("The config does not contain a list of accounts.");
		return;
	}

	console.log(`VkCloneManager v.1.1.2
Developer: Rinat Namazov
Copyright (c) 2021 RINWARES <rinwares.com>
`);

	var vkCloneManager = new VkCloneManager(config);

	await vkCloneManager.loadAllModules();
	await vkCloneManager.checkRuCaptchaBalance();
	await vkCloneManager.initAccounts();

	let selectModuleQuestion = {
		type: "list",
		name: "moduleName",
		message: "Select a module to run:",
		choices: getModuleChoices(vkCloneManager)
	};

	while (true) {
		const { moduleName } = await inquirer.prompt(selectModuleQuestion);
		if (moduleName == "exit") {
			break;
		} else if (moduleName == "reload") {
			await reloadModuleCommand(vkCloneManager, selectModuleQuestion);
			selectModuleQuestion.choices = getModuleChoices(vkCloneManager);
		} else {
			await vkCloneManager.runModule(moduleName);
		}
	}
}

main();
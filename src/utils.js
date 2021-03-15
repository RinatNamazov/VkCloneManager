/*****************************************************************************
 *
 *  PROJECT:        VkCloneManager
 *  LICENSE:        See LICENSE in the top level directory
 *  FILE:           utils.js
 *  DESCRIPTION:    Utils
 *  COPYRIGHT:      (c) 2021 RINWARES <rinwares.com>
 *  DEVELOPER:      Rinat Namazov <rinat.namazov@rinwares.com>
 *
 *****************************************************************************/

const inquirer = require("inquirer");
const fsb = require("fs");
const fs = fsb.promises;
const fsc = fsb.constants;

function isNumeric(num) {
	return !isNaN(num)
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function terminalReadId(question) {
	const { userId } = await inquirer.prompt({
		type: "input",
		name: "userId",
		message: question || "User ID:",
		filter: String,
		validate: value => {
			if (isNumeric(value)) {
				return true;
			}
			return "Please enter a valid user ID!";
		}
	});
	return userId;
}

async function terminalReadPath(question, defaultPath) {
	const { filePath } = await inquirer.prompt({
		type: "input",
		name: "filePath",
		message: question || "The path to the file:",
		default: defaultPath || "./list.txt",
		filter: String,
		validate: async (value) => {
			try {
				await fs.access(value, fsc.R_OK)
				return true;
			} catch (e) {
				if (e.code != "ENOENT") {
					console.log(e);
				}
			}
			return "Please enter a valid file path!";
		},
	});
	return filePath;
}

async function terminalReadUserList(accounts, question) {
	const listTypeChoices = ["input", "file", "get user friends"];
	let answers = await inquirer.prompt({
		type: "list",
		name: "listType",
		message: question || "Where to get the list of users?",
		choices: listTypeChoices
	});

	let users;

	switch (answers.listType) {
		case listTypeChoices[0]: {
			answers = await inquirer.prompt({
				type: "input",
				name: "users",
				message: "List user IDs separated by commas:",
				filter: String,
				validate: value => {
					if (/^[0-9,\s]+$/.test(value)) {
						return true;
					}
					return "Please enter a valid list of user IDs!";
				}
			});
			users = answers.users.replace(/\s+/g, "").split(",");
			break;
		}
		case listTypeChoices[1]: {
			const filePath = await terminalReadPath("The path to the user IDs list file:", "./friends_list.txt");
			let fileContent = await fs.readFile(filePath, "utf8");
			// Todo: Add file content validating.
			users = fileContent.replace(/[\s\r]+#.*/g, "").trim().split("\n");
			break;
		}
		case listTypeChoices[2]: {
			const fromUser = await terminalReadId("User ID from which you want to copy friends IDs:");
			users = await accounts[0].call("friends.get", { user_id: fromUser }).items;
			break;
		}
	}

	return users;
}

module.exports = {
	isNumeric,
	sleep,
	terminalReadUserList,
	terminalReadId,
	terminalReadPath
};
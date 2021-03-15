/*****************************************************************************
 *
 *  PROJECT:        VkCloneManager
 *  LICENSE:        See LICENSE in the top level directory
 *  FILE:           modules/friends.js
 *  DESCRIPTION:    Centralized friends adding
 *  COPYRIGHT:      (c) 2021 RINWARES <rinwares.com>
 *  DEVELOPER:      Rinat Namazov <rinat.namazov@rinwares.com>
 *
 *****************************************************************************/

const inquirer = require("inquirer");
const fs = require("fs").promises;
const utils = require("../utils");

async function advancedAddFriends(accounts) {
	const users = await utils.terminalReadUserList(accounts, "Where to get the list of users to need add as friends?");

	for (let i in users) {
		const userId = users[i];
		for (let j in accounts) {
			await accounts[j].call("friends.add", { user_id: userId })
				.catch(e => console.log(e));
			await utils.sleep(50);
		}
	}
}

async function addingEachOtherAsFriends(accounts) {
	for (let i in accounts) {
		const account1 = accounts[i];
		for (let j in accounts) {
			const account2 = accounts[j];
			if (account1.session.user_id != account2.session.user_id) {
				await account1.call("friends.add", { user_id: account2.session.user_id });
				await utils.sleep(50);
			}
		}
	}
}

async function addFriends(accounts) {
	const modeChoices = ["advanced", "adding each other as friends"];
	const { mode } = await inquirer.prompt({
		type: "list",
		name: "mode",
		message: "Select mode:",
		choices: modeChoices
	});

	switch (mode) {
		case modeChoices[0]:
			await advancedAddFriends(accounts);
			break;

		case modeChoices[1]:
			await addingEachOtherAsFriends(accounts);
			break;
	}
}

module.exports = addFriends;
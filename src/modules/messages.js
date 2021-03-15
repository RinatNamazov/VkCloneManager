/*****************************************************************************
 *
 *  PROJECT:        VkCloneManager
 *  LICENSE:        See LICENSE in the top level directory
 *  FILE:           modules/messages.js
 *  DESCRIPTION:    Centralized messaging
 *  COPYRIGHT:      (c) 2021 RINWARES <rinwares.com>
 *  DEVELOPER:      Rinat Namazov <rinat.namazov@rinwares.com>
 *
 *****************************************************************************/

const inquirer = require("inquirer");
const easyvk = require("easyvk");
const utils = require("../utils");

async function sendMessage(accounts) {
	const users = await utils.terminalReadUserList(accounts, "Where to get the list of users to need send message?");

	const { message } = await inquirer.prompt({
		type: "input",
		name: "message",
		message: "Message to send:",
		filter: String,
		validate: value => {
			if (value.length > 0) {
				return true;
			}
			return "Please enter a message!";
		}
	});

	for (let i in accounts) {
		for (let j in users) {
			await accounts[i].call("messages.send", { user_id: users[j], message: message, random_id: easyvk.randomId() })
				.catch(e => console.log(e));
			await utils.sleep(50);
		}
	}
}

module.exports = sendMessage;
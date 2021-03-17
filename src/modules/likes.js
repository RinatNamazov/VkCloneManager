/*****************************************************************************
 *
 *  PROJECT:        VkCloneManager
 *  LICENSE:        See LICENSE in the top level directory
 *  FILE:           modules/likes.js
 *  DESCRIPTION:    Centralized likes
 *  COPYRIGHT:      (c) 2021 RINWARES <rinwares.com>
 *  DEVELOPER:      Rinat Namazov <rinat.namazov@rinwares.com>
 *
 *****************************************************************************/

const inquirer = require("inquirer");
const utils = require("../utils");

async function advancedLike(accounts) {
	const { likeType } = await inquirer.prompt({
		type: "list",
		name: "likeType",
		message: "Select the like type:",
		choices: [
			"post", "comment", "photo", "audio", "video",  "note",  "market",
			"photo_comment",  "video_comment",  "topic_comment",  "market_comment"
		]
	});

	const ownerId = await utils.terminalReadId(`Owner (user/group id) of ${likeType}:`);
	const itemId = await utils.terminalReadId(`Item id of ${likeType}:`);

	for (let i in accounts) {
		await accounts[i].call("likes.add", { type: likeType, owner_id: ownerId, item_id: itemId })
			.catch(e => console.log(e));
		await utils.sleep(50);
	}
}

async function likeUserProfilePhoto(accounts) {
	const userIds = await utils.terminalReadUserList(accounts, "Where to get the list of users to need like profile photo?");

	let users;
	try {
		users = await accounts[0].call("users.get", { user_ids: userIds.join(","), fields: "has_photo, photo_id" });
	} catch (err) {
		console.log(err);
		return;
	}

	for (let i in users) {
		if (typeof(i) != "number") { // Ignore 'queryData'.
			continue;
		}

		const user = users[i];
		if (!user.has_photo) {
			console.log(`User with id ${user.id} does not have an avatar.`);
			continue;
		}
		if (!user.can_access_closed) {
			console.log(`User with id ${user.id} has a closed profile and you do not have access to view it.`);
			continue;
		}
		
		// The real photo ID is contained in the second part: ownerId_photoId
		const itemId = user.photo_id.split("_")[1];

		for (let i in accounts) {
			await accounts[i].call("likes.add", { type: "photo", owner_id: user.id, item_id: itemId })
				.catch(e => console.log(e));
			await utils.sleep(50);
		}
	}
}

async function likeEachOtherAvatars(accounts) {
	for (let i in accounts) {
		const account1 = accounts[i];
		for (let j in accounts) {
			const account2 = accounts[j];
			if (account1.session.user_id != account2.session.user_id) {
				let user;
				try {
					user = await account1.call("users.get", { user_ids: account2.session.user_id, fields: "has_photo, photo_id" });
					user = user[0];
				} catch (err) {
					console.log(err);
					continue;
				}
				if (user.has_photo) {
					const itemId = user.photo_id.split("_")[1];
					await account1.call("likes.add", { type: "photo", owner_id: account2.session.user_id, item_id: itemId })
						.catch(e => console.log(e));
					await utils.sleep(50);
				}
			}
		}
	}
}

async function likeObject(accounts) {
	const modeChoices = ["advanced", "like user profile photo", "like each other avatars"];
	const { mode } = await inquirer.prompt({
		type: "list",
		name: "mode",
		message: "Select mode:",
		choices: modeChoices
	});

	switch (mode) {
		case modeChoices[0]:
			await advancedLike(accounts);
			break;

		case modeChoices[1]:
			await likeUserProfilePhoto(accounts);
			break;

		case modeChoices[2]:
			await likeEachOtherAvatars(accounts);
			break;
	}
}

module.exports = likeObject;
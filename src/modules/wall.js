/*****************************************************************************
 *
 *  PROJECT:        VkCloneManager
 *  LICENSE:        See LICENSE in the top level directory
 *  FILE:           modules/wall.js
 *  DESCRIPTION:    Centralized posts management
 *  COPYRIGHT:      (c) 2021 RINWARES <rinwares.com>
 *  DEVELOPER:      Rinat Namazov <rinat.namazov@rinwares.com>
 *
 *****************************************************************************/

const utils = require("../utils");

async function joinGroup(accounts) {
	const ownerId = await utils.terminalReadId("What is the user ID from which you want to copy the wall?");

	const wall = await accounts[0].call("wall.get", { owner_id: ownerId }).items;

	for (let i in wall) {
		const post = wall[i];
		for (let j in accounts) {
			// Todo: Only the text is copied, need to redo it.
			await accounts[j].call("wall.post", { message: post.text })
				.catch(e => console.log(e));
			await utils.sleep(50);
		}
	}
}

module.exports = joinGroup;
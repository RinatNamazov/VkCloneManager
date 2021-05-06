/*****************************************************************************
 *
 *  PROJECT:        VkCloneManager
 *  LICENSE:        See LICENSE in the top level directory
 *  FILE:           modules/groups.js
 *  DESCRIPTION:    Centralized group joining
 *  COPYRIGHT:      (c) 2021 RINWARES <rinwares.com>
 *  DEVELOPER:      Rinat Namazov <rinat.namazov@rinwares.com>
 *
 *****************************************************************************/

const utils = require("../utils");

async function joinGroup(accounts) {
	const groupId = await utils.terminalReadId("Which group should you join?");

	for (let i in accounts) {
		await accounts[i].call("groups.join", { group_id: groupId })
			.catch(e => console.log(e));
		await utils.sleep(50);
	}
}

module.exports = joinGroup;
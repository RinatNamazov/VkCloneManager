/*****************************************************************************
 *
 *  PROJECT:        VkCloneManager
 *  LICENSE:        See LICENSE in the top level directory
 *  FILE:           modules/video.js
 *  DESCRIPTION:    Centralized video management
 *  COPYRIGHT:      (c) 2021 RINWARES <rinwares.com>
 *  DEVELOPER:      Rinat Namazov <rinat.namazov@rinwares.com>
 *
 *****************************************************************************/

const utils = require("../utils");

async function copyVideo(accounts) {
	const ownerId = await utils.terminalReadId("What is the user ID from which you want to copy the video?");

	const video = await accounts[0].call("video.get", { owner_id: ownerId }).items;

	for (let i in video) {
		const vid = video[i];
		for (let j in accounts) {
			await accounts[j].call("video.add", { video_id: vid.id, owner_id: vid.owner_id })
				.catch(e => console.log(e));
			await utils.sleep(50);
		}
	}
}

module.exports = copyVideo;
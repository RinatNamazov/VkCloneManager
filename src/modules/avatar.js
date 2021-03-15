/*****************************************************************************
 *
 *  PROJECT:        VkCloneManager
 *  LICENSE:        See LICENSE in the top level directory
 *  FILE:           modules/avatar.js
 *  DESCRIPTION:    Centralized change of avatar
 *  COPYRIGHT:      (c) 2021 RINWARES <rinwares.com>
 *  DEVELOPER:      Rinat Namazov <rinat.namazov@rinwares.com>
 *
 *****************************************************************************/

const inquirer = require("inquirer");
const fsb = require("fs");
const fs = fsb.promises;
const fsc = fsb.constants;
const utils = require("../utils")

async function changeAvatar(accounts) {
	const filePath = await utils.terminalReadPath("The path to the avatar file:", "./avatar.png");

	for (let i in accounts) {
		const account = accounts[i];

		let { url: uploadUrl } = await account.uploader.getUploadURL("photos.getOwnerPhotoUploadServer", {}, false);
		let { vkr: fileData } = await account.uploader.uploadFile(uploadUrl, filePath, "photo", {});

		await account.call("photos.saveOwnerPhoto", fileData);
	}
}

module.exports = changeAvatar;
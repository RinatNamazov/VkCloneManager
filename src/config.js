/*****************************************************************************
 *
 *  PROJECT:        VkCloneManager
 *  LICENSE:        See LICENSE in the top level directory
 *  FILE:           config.js
 *  DESCRIPTION:    Config
 *  COPYRIGHT:      (c) 2021 RINWARES <rinwares.com>
 *  DEVELOPER:      Rinat Namazov <rinat.namazov@rinwares.com>
 *
 *****************************************************************************/

const config = {
	rucaptcha_api_key: "", // Optional. https://rucaptcha.com/
	accounts: [
		{
			name: "", // Optional, acts like a comment.
			username: "", // Phone number or email.
			password: "",
			proxy: "" // Optional.
		},
		{
			username: "",
			password: "",
		}
		// The number of accounts is not limited.
	]
};

module.exports = config;
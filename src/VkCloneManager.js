/*****************************************************************************
 *
 *  PROJECT:        VkCloneManager
 *  LICENSE:        See LICENSE in the top level directory
 *  FILE:           VkCloneManager.js
 *  DESCRIPTION:    VK accounts manager
 *  COPYRIGHT:      (c) 2021 RINWARES <rinwares.com>
 *  DEVELOPER:      Rinat Namazov <rinat.namazov@rinwares.com>
 *
 *****************************************************************************/

const path = require("path");
const fsb = require("fs");
const fs = fsb.promises;
const fsc = fsb.constants;
const easyvk = require("easyvk");
const rucaptcha = require("rucaptcha-client");

class VkCloneManager {
	#config = {};
	#sessionsDir = path.join(__dirname, "..", "sessions");
	#modulesDir = path.join(__dirname, "modules");
	#modules = new Map();
	#accounts = new Array();
	#rucaptcha = null;

	constructor(config) {
		this.#config = config;
		if (typeof(this.#config.rucaptcha_api_key) === "string" && this.#config.rucaptcha_api_key !== "") {
			this.#rucaptcha = new rucaptcha(this.#config.rucaptcha_api_key);
		}
	}

	captchaHandler({captcha_sid, captcha_img, resolve, vk}) {
		console.log(`Account ${vk.session.username}: Trying to solve the captcha (${captcha_sid}):", ${captcha_img}`);

		this.#rucaptcha.solve(captcha_img).then(answer => {
			resolve(answer.text).then(() => {
				console.log(`Captcha (${captcha_sid}) successfully solved.`);
			}).catch(({err, reCall}) => {
				if (err) {
					console.log(err);
				}
				console.log(`Failed to solve captcha (${captcha_sid}). Retrying...`);
				reCall();
			});
		}).catch(e => console.log(e));
	}

	async checkRuCaptchaBalance() {
		if (this.#rucaptcha) {
			const balance = await this.#rucaptcha.getBalance();
			console.log(`\nRuCaptcha balance: ${balance}`);
			return balance
		}
	}

	async initAccounts() {
		try {
			await fs.access(this.#sessionsDir, fsc.R_OK | fsc.W_OK);
		} catch (e) {
			if (e.code == "ENOENT") {
				await fs.mkdir(this.#sessionsDir);
			} else {
				console.log(e);
				return;
			}
		}

		const captchaHandler = this.#rucaptcha != null ? this.captchaHandler : null;
		for (let i in this.#config.accounts) {
			const acc = this.#config.accounts[i];
			if (acc.username != "" && acc.password != "") {
				try {
					const account = await easyvk({
						authType: "user",
						username: acc.username,
						password: acc.password,
						session_file: path.join(this.#sessionsDir, "session_" + acc.username),
						proxy: acc.proxy,
						captchaHandler: captchaHandler,
						utils: {
							uploader: true
						}
					});
					this.#accounts.push(account);
				} catch (e) {
					console.log(`Failed to login to VK account: ${acc.username}.`, e);
				}
			}
		}

		console.log(`\nSuccessfully authenticated ${this.#accounts.length} VK accounts.\n`);
		return this.#accounts.length;
	}

	getModulesList() {
		return Array.from(this.#modules.keys());
	}

	loadModule(moduleName) {
		try {
			switch (moduleName) {
				case "exit":
				case "reload":
				case "all":
					throw new Error("Module name should not be a reserved word ('exit', 'reload', 'all').");
			}
			const modulePath = path.join(this.#modulesDir, moduleName + ".js");
			this.#modules.set(moduleName, require(modulePath));
			console.log(`Module '${moduleName}' successfully loaded.`);
			return true;
		} catch (e) {
			console.log(`Failed to load '${moduleName}' module.`, e);
		}
		return false;
	}

	unloadModule(moduleName) {
		try {
			if (this.#modules.delete(moduleName)) {
				const modulePath = path.join(this.#modulesDir, moduleName + ".js");
				delete require.cache[modulePath];
				console.log(`Module '${moduleName}' successfully unloaded.`);
				return true;
			}
		} catch (e) {
			console.log(`Failed to unload '${moduleName}' module.`, e);
		}
		return false;
	}

	reloadModule(moduleName) {
		try {
			if (this.#modules.delete(moduleName)) {
				const modulePath = path.join(this.#modulesDir, moduleName + ".js");
				delete require.cache[modulePath];
				this.#modules.set(moduleName, require(modulePath));
				console.log(`Module '${moduleName}' successfully reloaded.`);
				return true;
			}
		} catch (e) {
			console.log(`Failed to reload '${moduleName}' module.`, e);
		}
		return false;
	}

	async loadAllModules() {
		const filesInDir = await fs.readdir(this.#modulesDir);
		for (const filename of filesInDir) {
			this.loadModule(path.parse(filename).name);
		}
		console.log(`Successfully loaded ${this.#modules.size} modules.`);
	}

	unloadAllModules() {
		const modulesSize = this.#modules.size;
		for (let moduleName of this.#modules.keys()) {
			this.unloadModule(moduleName);
		}
		console.log(`Successfully unloaded ${modulesSize} modules.`);
	}

	async reloadAllModules() {
		this.unloadAllModules();
		await this.loadAllModules();
	}

	async runModule(moduleName) {
		if (this.#modules.has(moduleName)) {
			const moduleEntry = this.#modules.get(moduleName);
			try {
				await moduleEntry(this.#accounts);
				return true;
			} catch (e) {
				console.log(`Failed run module '${moduleName}'.`, e);
			}
		}
		return false;
	}
};

module.exports = VkCloneManager;
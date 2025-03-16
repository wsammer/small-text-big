/**
 * Copyright (C) 2023-2025 Sameer W. All rights reserved.
 * License: https://github.com/wsammer/small-text-big/blob/main/LICENSE
 */

'use strict';

let storage = chrome.storage.local;

let title_apply  = 'Apply Small Text Big';
let title_remove = 'Remove Small Text Big';

let tabs          = new Set();
let disabled_tabs = new Set();

chrome.runtime.onInstalled.addListener(function(details){

	if (details.reason === 'install') {

		let defaults = {
			'globalStr': 0,
			'size': 14,
			'sizeThreshold': 18,
			'weight': 400,
			'skipColoreds': true,
			'enableEverywhere': true
		};

		storage.set(defaults);

		chrome.tabs.create({ url: 'Welcome.html' });
		return;
	}
});

chrome.runtime.onMessage.addListener( async (request, sender, sendResponse) => {

	if (request.from !== 'toggle')
		return;

	let title;
	let path;

	if (request.enabled) {
		title = title_remove;
		path = 'assets/icons/halo.png';

		tabs.add(sender.tab.id);
		disabled_tabs.delete(sender.tab.id);
	} else {
		title = title_apply;
		path  = 'assets/icons/halo.png';

		tabs.delete(sender.tab.id);
		disabled_tabs.add(sender.tab.id);
	}

});

chrome.tabs.onUpdated.addListener(function(tabId, change_info, tab) {

	if (change_info.status !== 'complete')
		return;

	let url = tab.url;
	let hostname = '';

	if (url.startsWith('file://')) {
		hostname = url;
	} else {
		let matches = url.match(/\/\/(.+?)\//);

		if (matches)
			hostname = matches[1];
	}

	let data = [
		'whitelist',
		'blacklist',
		'enableEverywhere',
	];

	storage.get(data, items => {

		let blacklist = items.blacklist || [];

		if (blacklist.find(o => o.url === hostname)) {
			return;
		}

		let options = {
			file: 'src/enable.js',
			runAt: 'document_end',
			allFrames: true,
			matchAboutBlank: true
		};

		if (items.enableEverywhere && !disabled_tabs.has(tabId)) {
//			chrome.scripting.executeScript(tabId, options);
			return;
		}

		let whitelist = items.whitelist || [];

//		if (whitelist.find(x => x.url === hostname))
//			chrome.scripting.executeScript(tabId, options);
	});
});

chrome.commands.onCommand.addListener(function(command)  {

	let tabs = chrome.tabs.query({ currentWindow: true, active: true });
	let id   = tabs[0].id;

	toggle(chrome.browserAction.getTitle({ tabId: id }), id);
});

chrome.tabs.onRemoved.addListener(function(tab) {
	tabs.delete(tab.id);
	disabled_tabs.delete(tab.id);
});

function toggle(title, tab_id)
{
	let options = {
		file: 'src/enable.js',
		runAt: 'document_end',
		allFrames: true,
		matchAboutBlank: true
	};

//	chrome.scripting.executeScript(tabId, options);
}

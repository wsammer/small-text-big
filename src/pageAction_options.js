/**
 * Copyright (C) 2023-2025 Sameer W. All rights reserved.
 * License: https://github.com/wsammer/small-text-big/blob/main/LICENSE
 */

let storage = chrome.storage.local;

let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);

let url_text = $('#url');
let refreshBtn = $("#refreshBtn");

let url_visible = false;

function init(tabs)
{
	let strSlider       = $("#strSlider");
	let strLabel        = $("#strLabel");

	let sizeSlider      = $("#sizeSlider");
	let sizeLabel       = $("#sizeLabel");

	let thresholdSlider = $("#thresholdSlider");
	let thresholdLabel  = $("#thresholdLabel");

	let weight_slider   = $('#weightSlider');
	let weight_label    = $('#weightLabel');

	let WLcheck         = $("#addWL");
	let BLcheck         = $("#addBL");
	let BLchecktemp     = $("#addBLtemp");

	let input_border    = $("#outline");
	let pseudoAB        = $("#pseudoAB");
	let forceOpacity    = $("#forceOpacity");
	let makeCaps        = $("#makeCaps");
	let normalInc2      = $("#normalInc2");
	let start3          = $("#start3");
	let skipLinks       = $("#skipLinks");
	let fontFamily      = $("#fontFamily");
	let fontFamilyName  = $("#fontFamilyName");
	let customCss       = $("#customCss");
	let customCssText   = $("#customCssText");
	let skipNavSection  = $("#skipNavSection");
	let skipHeights     = $("#skipHeights");
	let skipColoreds    = $("#skipColoreds");

	let optionsBtn      = $("#optionsBtn");
	let presetSel       = $("#presetSelect");
	let presetSave      = $("#presetSave");
	let presetLoad      = $("#presetLoad");

	let url = tabs[0].url;

	let hostname = '';

	chrome.storage.local.get(["lightness", "default_size"]).then((result) => {
		if (result.lightness && result.default_size) {
			LightDark.innerText = 'Site lightness = '+result.lightness.toFixed(2);
			LightDark.innerText += '\nBrowser font size = '+result.default_size;
		}
	});

	if (url.startsWith('file://')) {
		hostname = url;
	} else if (url.endsWith('#full_url')) {
		hostname = url;
	} else {
		hostname = url.match(/\/\/(.+?)\//)[1];

		if (!url.startsWith('http'))
			showRefreshBtn();
	}

	url_text.innerText = hostname;

	if (hostname == undefined) hostname = '';

	strSlider.oninput = () => {
		strLabel.innerText = strSlider.value;
		chrome.storage.local.set( { url: hostname, azoom: Math.abs(parseFloat(strSlider.value)/100).toFixed(2), afont: fontFamilyName.value } );
		if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); }
	}
	sizeSlider.oninput = () => { sizeLabel.innerText = sizeSlider.value; if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); } }
	thresholdSlider.oninput = () => { thresholdLabel.innerText = thresholdSlider.value; if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); } }
	weight_slider.oninput = () => { weight_label.innerText = weight_slider.value; if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); } }
	customCssText.oninput = () => { if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); } }
	fontFamilyName.oninput = () => { if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); } }

	optionsBtn.onclick = () =>  {
		if (chrome.runtime.openOptionsPage)
			chrome.runtime.openOptionsPage();
		else
			window.open(chrome.runtime.getURL('options.html'));
	};

	fontFamily.onchange = () =>  {
		chrome.storage.local.set( { url:hostname, azoom: Math.abs(parseFloat(strSlider.value)/100).toFixed(2), afont: fontFamilyName.value } );
		if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); }
	}
	fontFamilyName.onkeydown = (e) => {
		if (e.keyCode == 13) {
			chrome.storage.local.set( { url:hostname, azoom: Math.abs(parseFloat(strSlider.value)/100).toFixed(2), afont: fontFamilyName.value } );
			if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); }
		}
	}

	let settings = [
		"whitelist",
		"blacklist",
		"globalStr",
		"strength",
		"size",
		"sizeThreshold",
		"weight",
		"pseudoAB",
		"forceOpacity",
		"makeCaps",
		"normalInc2",
		"start3",
		"skipLinks",
		"skipNavSection",
		"skipHeights",
		"underlineLinks",
		"input_border",
		"fontFamily",
		"fontFamilyName",
		"customCss",
		"customCssText",
		"skipColoreds",
		"presetNumber"
	];

	let start = settings =>
	{
		let whitelist = settings.whitelist || [];
		let blacklist = settings.blacklist || [];

		let item = settings;

		if (blacklist.findIndex(o => o.url === hostname) > -1) {
			let idx = whitelist.findIndex(o => o.url === hostname);
			if (idx < 0) {
				BLcheck.checked = true;
				BLchecktemp.checked = false;
			} else {
				BLchecktemp.checked = true;
				BLcheck.checked = false;
			}
		} else {
			let idx = -1 ;
			idx = whitelist.findIndex(o => o.url === '#preset'+ item.presetNumber);

			if (idx <= 0)
				idx = whitelist.findIndex(o => o.url === hostname);

			if (idx > -1) {
				item = whitelist[idx];

				WLcheck.checked = true;
				BLcheck.checked = false;
			}
		}

		strSlider.value          = item.strength || item.globalStr;
		strLabel.innerText       = item.strength || item.globalStr;
		sizeSlider.value         = item.size || 0;
		sizeLabel.innerText      = item.size || 0;
		thresholdSlider.value    = item.threshold || item.sizeThreshold || 0;
		thresholdLabel.innerText = item.threshold || item.sizeThreshold || 0;
		weightSlider.value       = item.weight;
		weightLabel.innerText    = item.weight;
		presetSel.value          = parseInt(item.presetNumber) || 0;

		input_border.checked     = item.input_border;
		pseudoAB.checked         = item.pseudoAB;
		forceOpacity.checked     = item.forceOpacity;
		makeCaps.checked         = item.makeCaps;
		normalInc2.checked       = item.normalInc2;
		start3.checked           = item.start3;
		skipLinks.checked        = item.skipLinks;
		skipNavSection.checked   = item.skipNavSection;
		skipColoreds.checked     = item.skipColoreds;
		skipHeights.checked      = item.skipHeights;
		underlineLinks.checked   = item.underlineLinks;
		fontFamily.checked       = item.fontFamily;
		fontFamilyName.value     = item.fontFamilyName || '';
		customCss.checked        = item.customCss;
		customCssText.value      = item.customCssText || '';
		
		if (!start3.checked)
			$('#skiplinks-div').style.display = 'none';
		else
			$('#skiplinks-div').style.display = 'block';
		if (!customCss.checked) {
			$('#custom-text-div').style.display = 'none';
		} else {
			$('#custom-text-div').style.display = 'block';
			$('#customCssText').value = customCssText.value;
		}
		if (!fontFamily.checked) {
			$('#fontFamilyName').style.display = 'none';
		} else {
			$('#fontFamilyName').style.display = 'block';
			$('#fontFamilyName').value = fontFamilyName.value;
		}

		let getOptions = () => {
			let wl_item = {
				url:            hostname,
				strength:       strSlider.value,
				size:           sizeSlider.value,
				threshold:      thresholdSlider.value,
				weight:         weightSlider.value,
				pseudoAB:	pseudoAB.checked,
				forceOpacity:   forceOpacity.checked,
				makeCaps:       makeCaps.checked,
				normalInc2:     normalInc2.checked,
				start3:         start3.checked,
				skipLinks:      skipLinks.checked,
				skipNavSection: skipNavSection.checked,
				skipColoreds:   skipColoreds.checked,
				skipHeights:    skipHeights.checked,
				underlineLinks: underlineLinks.checked,
				input_border:   input_border.checked,
				fontFamily:     fontFamily.checked,
				fontFamilyName: fontFamilyName.value,
				customCss:      customCss.checked,
				customCssText:  customCssText.value,
				presetNumber:	presetSel.value
			}

			return wl_item;
		}

		presetSave.onclick = () => {
			hostname = '#preset'+ presetSel.value;
			whitelist = updateList(getOptions(),true, true, presetSel.value);
			showRefreshBtn();
		};

		presetLoad.onclick = () => {
			let idx = whitelist.findIndex(o => o.url === '#preset'+presetSel.value);
			if (idx > -1) {
			item = whitelist[idx];

			strSlider.value          = item.strength || item.globalStr;
			strLabel.innerText       = item.strength || item.globalStr;
			sizeSlider.value         = item.size || 0;
			sizeLabel.innerText      = item.size || 0;
			thresholdSlider.value    = item.threshold || item.sizeThreshold || 0;
			thresholdLabel.innerText = item.threshold || item.sizeThreshold || 0;
			weightSlider.value       = item.weight;
			weightLabel.innerText    = item.weight;
			presetSel.value          = parseInt(item.presetNumber);

			input_border.checked     = item.input_border;
			pseudoAB.checked         = item.pseudoAB;
			forceOpacity.checked     = item.forceOpacity;
			makeCaps.checked         = item.makeCaps;
			normalInc2.checked       = item.normalInc2;
			start3.checked           = item.start3;
			skipLinks.checked        = item.skipLinks;
			skipNavSection.checked   = item.skipNavSection;
			skipColoreds.checked     = item.skipColoreds;
			skipHeights.checked      = item.skipHeights;
			underlineLinks.checked   = item.underlineLinks;
			fontFamily.checked       = item.fontFamily;
			fontFamilyName.value     = item.fontFamilyName;
			customCss.checked        = item.customCss;
			customCssText.value      = item.customCssText || '';

			WLcheck.checked = true;	
			WLcheck.click();

			if (!start3.checked)
				$('#skiplinks-div').style.display = 'none';
			else
				$('#skiplinks-div').style.display = 'block';
			if (!customCss.checked) {
				$('#custom-text-div').style.display = 'none';
			} else {
				$('#custom-text-div').style.display = 'block';
				$('#customCssText').value = customCssText.value;
			}
			if (!fontFamily.checked) {
				$('#fontFamilyName').style.display = 'none';
			} else {
				$('#fontFamilyName').style.display = 'block';
				$('#fontFamilyName').value = fontFamilyName.value;
			}
			showRefreshBtn();
			return;
			}
		};

		WLcheck.onclick = () => {
			let is_checked = WLcheck.checked;

			whitelist = updateList(getOptions(), true, is_checked);

			if (is_checked) {
				let idx = blacklist.findIndex(o => o.url === hostname);

				if(idx > -1)
					blacklist = updateList({ url: hostname }, false, false);
			}
		};

		BLchecktemp.onclick = () => {
			let is_checked = BLchecktemp.checked;

			blacklist = updateList({ url: hostname }, false, is_checked);

			if (is_checked) {
				BLcheck.checked = false;
				WLcheck.checked = true;
			}
		};

		BLcheck.onclick = () => {
			let is_checked = BLcheck.checked;

			blacklist = updateList({ url: hostname }, false, is_checked);

			if (is_checked) {
				let idx = whitelist.findIndex(o => o.url === hostname);

				if(idx > -1)
					whitelist = updateList(getOptions(), true, false);
			}
		};

		$$('.option').forEach(checkbox => {
			checkbox.onclick = () => {
				if (checkbox.id === 'WL') {
					if (WLcheck.checked) {
						WLcheck.checked = false;
					} else {
						WLcheck.checked = true;
					}
					WLcheck.onclick();
					return;
				}
				if (checkbox.id === 'BL') {
					if (BLcheck.checked) {
						BLcheck.checked = false;
					} else {
						BLcheck.checked = true;
					}
					BLcheck.onclick();
					return;
				}
				if (checkbox.id === 'BLtemp') {
					if (BLchecktemp.checked) {
						BLchecktemp.checked = false;
					} else {
						BLchecktemp.checked = true;
					}
					BLchecktemp.onclick();
					return;
				}
				if (checkbox.id  === 'skiplinks') {
					const skiplinks_div = document.querySelector('#skiplinks-div');

					if (start3.checked)
						skiplinks_div.style.display = 'block';
					else
						skiplinks_div.style.display = 'none';
				}

				if (checkbox.id  === 'custom-div') {
					const customText_div = document.querySelector('#custom-text-div');

					if (customCss.checked) {
						customText_div.style.display = 'block';
						$('#customCssText').value = customCssText.value;

					} else {
						customText_div.style.display = 'none';
					}
				}

				if (checkbox.id === 'font-family') {
					const font_div = document.querySelector('#fontFamilyName');
					if (fontFamily.checked) {
						font_div.style.display = 'block';
						$('#fontFamilyName').value = fontFamilyName.value;
					} else {
						font_div.style.display = 'none';
					}
				}

				whitelist = updateList(getOptions(), true, true);

				if (BLcheck.checked || BLchecktemp.checked)
					blacklist = updateList({ url: hostname }, false, false);
			}
		});

		let updateList = (item, is_wl, add, pno = 0) => {
			let list;
			let list_name;
			let check;

			if (is_wl) {
				list = whitelist;
				list_name = 'whitelist';
				check = WLcheck;
			} else {
				list = blacklist;
				list_name = 'blacklist';
				check = BLcheck;
			}

			let idx = -1;
			idx = list.findIndex(o => o.url === '#preset'+ pno);
			if (idx <= 0)
				idx = list.findIndex(o => o.url === item.url);

			if (add) {
				if (idx > -1)
					list[idx] = item;
				else
					list.push(item);

				check.checked = true;
			}
			else if (idx > -1) {
				list.splice(idx, 1);

				check.checked = false;
			}

			storage.set({ [list_name]: list });

			showRefreshBtn();

			return list;
		};
	}

	storage.get(settings, start);
};

if (typeof chrome.tabs !== 'undefined') {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	init(tabs);
});
}


function showRefreshBtn()
{
	if (url_visible)
		return;

	url_text.style.opacity = 0;
	url_text.style.zIndex = "2";

	refreshBtn.style.opacity = 1;
	refreshBtn.style.zIndex = "3";
	refreshBtn.style.cursor = "pointer";

	refreshBtn.onclick = () => chrome.tabs.reload();

	url_visible = true;
}

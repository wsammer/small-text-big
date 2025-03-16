"use strict";

let doc = document;
var fileListb = [];
var fileListw = [];

// Sliders
let strSlider       = doc.querySelector("#strSlider");
let strLabel        = doc.querySelector("#strLabel");
let sizeSlider      = doc.querySelector("#sizeSlider");
let sizeLabel       = doc.querySelector("#sizeLabel");
let threshSlider    = doc.querySelector("#threshSlider");
let threshLabel     = doc.querySelector("#threshLabel");
let weightSlider    = doc.querySelector("#weightSlider");
let weightLabel     = doc.querySelector("#weightLabel");

// Options
let globalEnabled   = doc.querySelector('#defaultEn');
let pseudoAB        = doc.querySelector('#pseudoAB');
let forceOpacity    = doc.querySelector('#forceOpacity');
let makeCaps        = doc.querySelector('#makeCaps');
let normalInc2      = doc.querySelector('#normalInc2');
let start3          = doc.querySelector('#start3');
let skipLinks       = doc.querySelector('#skipLinks');
let skipNavSection  = doc.querySelector('#skipNavSection');
let skipColoreds    = doc.querySelector('#skipColoreds');
let skipHeights     = doc.querySelector('#skipHeights');
let underlineLinks  = doc.querySelector('#underlineLinks');
let input_border    = doc.querySelector('#input-border');
let global_css      = doc.querySelector('#global-css');

// Whitelist
let WLtable         = doc.querySelector('#whitelist');
let WLaddButton     = doc.querySelector('#add');
let WLresetButton   = doc.querySelector('#reset');
let WLtextarea      = doc.querySelector('#urltext');
let WLtbody         = doc.querySelector("#WLtbody");

// Blacklist
let BLtable         = doc.querySelector('#blacklist');
let BLaddButton     = doc.querySelector('#BLadd');
let BLresetButton   = doc.querySelector('#BLreset');
let BLtextarea      = doc.querySelector('#BLurltext');
let BLtbody         = doc.querySelector("#BLtbody");

let wl = [];
let bl = [];

let g_list = [];

function addRow(item, is_wl)
{
	var table;
	var list, list_name;

	if (is_wl) {
		list = wl;
		list_name = 'whitelist';
		table = WLtbody;
		g_list = wl;
	} else {
		list = bl;
		list_name = 'blacklist';
		table = BLtbody;
	}

	var row;
	if (table != null) {
	row  = table.insertRow(-1);

	let url_cell = row.insertCell(0);

	url_cell.innerText = item.url;
	url_cell.setAttribute("contenteditable", "true");

	url_cell.onkeyup = () => {
		item.url = url_cell.innerText;
		chrome.storage.local.set({ [list_name]: list });
	};

	if (is_wl) {
		let strCell = row.insertCell(1);
		strCell.innerText = item.size;
		strCell.setAttribute("contenteditable", "true");

		strCell.onkeyup = (e) => {
			let new_str = parseInt(strCell.innerText);

			if (new_str > 300)
				new_str = 300;
			else if (new_str < -300)
				new_str = -300;

			item.size = new_str || strSlider.value;

			list[list.findIndex(o => o.url === url_cell.innerText)] = item;

			chrome.storage.local.set({'whitelist': list});
		};

		strCell.onkeydown = (e) => {

			/**
			 * Keyup/Keydown
			 * left arrow:   e.which = 37,  e.keyCode = 37
			 * right arrow:  e.which = 39,  e.keyCode = 39
			 * backspace:    e.which = 8,   e.keyCode = 8
			 * dash:         e.which = 173, e.keyCode = 173
			 * enter:        e.which = 13,  e.keyCode = 13
			 * We need both keyup and keydown if we want to save the settings immmediately
			 * Because keydown lags behind one character, but keyup's preventDefault() doesn't work
			 */
			let allowed_keys = [8, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 173];
			let is_allowed = allowed_keys.includes(e.keyCode) || allowed_keys.includes(e.which);

			if (!is_allowed)
				e.preventDefault();
		};
	}

	let rem_btn = doc.createElement("button");

	rem_btn.innerText = "Remove";
	rem_btn.setAttribute("class", "remove");

	rem_btn.onclick = () => {
		table.deleteRow(row.rowIndex - 1);
		list.splice(list.findIndex(o => o.url === url_cell.innerText), 1);
		chrome.storage.local.set({[list_name]: list});
	};

	let cell_pos = 2;

	if (!is_wl)
		--cell_pos;

	row.insertCell(cell_pos).appendChild(rem_btn);
	}
}

function init()
{
	addListeners();

	chrome.storage.local.get(['globalStr', 'size', 'weight', 'sizeThreshold','globalCss'], items => {
		if (typeof strSlider != 'undefined' && strSlider != null && typeof strSlider.value != 'undefined')
			strSlider.value       = items.globalStr;
		if (typeof strLabel != 'undefined' && strLabel != null && typeof strLabel.innerText != 'undefined')
			strLabel.innerText    = items.globalStr;
		if (typeof sizeSlider != 'undefined' && sizeSlider != null && typeof sizeSlider.value != 'undefined')
			sizeSlider.value      = items.size;
		if (typeof sizeLabel != 'undefined' && sizeLabel != null && typeof sizeLabel.innerText != 'undefined')
			sizeLabel.innerText   = items.size;
		if (typeof threshSlider != 'undefined' && threshSlider != null && typeof threshSlider.value != 'undefined')
			threshSlider.value    = items.sizeThreshold;
		if (typeof threshLabel != 'undefined' && threshLabel != null && typeof threshLabel.innerText != 'undefined')
			threshLabel.innerText = items.sizeThreshold;
		if (typeof weightSlider != 'undefined' && weightSlider != null && typeof weightSlider.value != 'undefined')
			weightSlider.value    = items.weight;
		if (typeof weightLabel != 'undefined' && weightLabel != null && typeof weightLabel.innerText != 'undefined')
			weightLabel.innerText = items.weight;
		if (typeof global_css != 'undefined' && global_css != null && typeof global_css.innerText != 'undefined')
			global_css.value      = items.globalCss == undefined ? '' : items.globalCss;
	});

	let checks = [
		"enableEverywhere",
		"forceOpacity",
		"pseudoAB",
		"makeCaps",
		"normalInc2",
		"start3",
		"skipLinks",
		"skipNavSection",
		"skipColoreds",
		"skipHeights",
		"underlineLinks",
		"input_border"
	];

	chrome.storage.local.get(checks, i => {
		if (doc.getElementById("defaultEn") != null)
			doc.getElementById("defaultEn").checked      = i.enableEverywhere;
		if (doc.getElementById("forceOpacity") != null)
			doc.getElementById("forceOpacity").checked   = i.forceOpacity;
		if (doc.getElementById("pseudoAB") != null)
			doc.getElementById("pseudoAB").checked       = i.pseudoAB;
		if (doc.getElementById("makeCaps") != null)
			doc.getElementById("makeCaps").checked       = i.makeCaps;
		if (doc.getElementById("normalInc2") != null)
			doc.getElementById("normalInc2").checked     = i.normalInc2;
		if (doc.getElementById("start3") != null)
			doc.getElementById("start3").checked         = i.start3;
		if (doc.getElementById("skipLinks") != null)
			doc.getElementById("skipLinks").checked      = i.skipLinks;
		if (doc.getElementById("skipNavSection") != null)
			doc.getElementById("skipNavSection").checked = i.skipNavSection;
		if (doc.getElementById("skipColoreds") != null)
			doc.getElementById("skipColoreds").checked   = i.skipColoreds;
		if (doc.getElementById("skipHeights") != null)
			doc.getElementById("skipHeights").checked    = i.skipHeights;
		if (doc.getElementById("underlineLinks") != null)
			doc.getElementById("underlineLinks").checked = i.underlineLinks;
		if (input_border != null)
			input_border.checked = i.input_border;
	});

	chrome.storage.local.get('whitelist', item => {
		if (!item.whitelist)
			return;

		wl = item.whitelist;

		let list = Array.from(item.whitelist);
		var item;

		for(item of list)
			addRow(item, true);
	});

	chrome.storage.local.get('blacklist', item => {
		if (!item.blacklist)
			return;

		bl = item.blacklist;

		let list = Array.from(item.blacklist);
		var item;

		for(item of list)
			addRow(item, false);
	});
	
	if (doc.getElementById("readb") !== null)
		doc.getElementById("readb").click();
	if (doc.getElementById("readw") !== null)
		doc.getElementById("readw").click();

}

init();

function isChecked(check)
{
	return doc.getElementById(check).checked;
}

function addListeners()
{
	if (globalEnabled !== null) {
	globalEnabled.onclick = () => {
		chrome.storage.local.set({'enableEverywhere': isChecked("defaultEn")});
	};
	}

	if (pseudoAB !== null) {
	pseudoAB.onclick = () => {
		chrome.storage.local.set({'pseudoAB': isChecked("pseudoAB")});
	};
	}

	if (forceOpacity !== null) {
	forceOpacity.onclick = () => {
		chrome.storage.local.set({'forceOpacity': isChecked("forceOpacity")});
	};
	}

	if (makeCaps !== null) {
	makeCaps.onclick = () => {
		chrome.storage.local.set({'makeCaps': isChecked("makeCaps")});
	};
	}

	if (normalInc2 !== null) {
	normalInc2.onclick = () => {
		chrome.storage.local.set({'normalInc2': isChecked("normalInc2")});
	};
	}

	if (start3 !== null) {
	start3.onclick = () => {
		chrome.storage.local.set({'start3': isChecked("start3")});
	};
	}

	if (skipLinks !== null) {
	skipLinks.onclick = () => {
		chrome.storage.local.set({'skipLinks': isChecked("skipLinks")});
	};
	}

	if (skipNavSection !== null) {
	skipNavSection.onclick = () => {
		chrome.storage.local.set({'skipNavSection': isChecked("skipNavSection")});
	};
	}

	if (skipColoreds !== null) {
	skipColoreds.onclick = () => {
		storage.set({'skipColoreds': isChecked("skipColoreds")});
	};
	}

	if (skipHeights !== null) {
	skipHeights.onclick = () => {
		chrome.storage.local.set({'skipHeights': isChecked("skipHeights")});
	};
	}

	if (underlineLinks !== null) {
	underlineLinks.onclick = () => {
		chrome.storage.local.set({'underlineLinks': isChecked("underlineLinks")});
	};
	}

	if (input_border !== null) {
	input_border.onclick = () => {
		chrome.storage.local.set({'input_border': isChecked("input-border")});
	};
	}

	if (WLaddButton !== null && WLresetButton !== null) {
	WLaddButton.addEventListener('click', saveURL.bind(this, true));
	WLresetButton.addEventListener('click', reset.bind(this, true));
	}

	if (BLaddButton  !== null && BLresetButton !== null) {
	BLaddButton.addEventListener('click', saveURL.bind(this, false));
	BLresetButton.addEventListener('click', reset.bind(this, false));
	}

	if (doc.getElementById("writew") !== null) {
	doc.getElementById("writew").onclick = () => {
		let w_item = {
			url:            "#reset0p",
			strength:       strSlider.value,
			size:           sizeSlider.value,
			threshold:      threshSlider.value,
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
			globalCss:      global_css.value,
			presetNumber:   0
			};
		let idx = wl.findIndex(o => o.url === "#reset0p");
		if (idx > -1) wl.splice(idx,1,w_item);
		chrome.storage.local.set({"whitelist": wl});
		let link = doc.createElement("a");
		let file = new Blob([JSON.stringify(wl)], { type: 'text/plain' });
		link.href = URL.createObjectURL(file);
		link.download = "whitelist.json";
		link.click();
		URL.revokeObjectURL(link.href);
		link.remove();
	};
	}

	if (doc.getElementById("readw") !== null) {
	doc.getElementById("readw").onclick = () => {
		let fileSelector = doc.getElementById('fileselectorw');
		fileSelector.addEventListener('change', (event) => { fileListw = event.target.files; });
		let f = fileListw[0];
		if (typeof fileListw[0] != 'undefined') {
		var reader = new FileReader();
		reader.onload = (function(theFile) {
		return function(e) {
		let JsonObj = JSON.parse(e.target.result);
		var items;
		var item;
		chrome.storage.local.set({'whitelist': JsonObj});
		chrome.storage.local.get('whitelist', items => {
		let list = Array.from(items.whitelist);
		for(item of list)
			addRow(item, true);


		let len = list.length;
		let x = list.findIndex(o => o.url === '#reset0p');
		if (x < len) {
		var item = list[x];
		strSlider.value          = item.strength;
		strLabel.innerText       = item.strength;
		strSlider.onchange();
		sizeSlider.value         = item.size;
		sizeLabel.innerText      = item.size;
		sizeSlider.onchange();
		threshSlider.value       = item.threshold;
		threshLabel.innerText    = item.threshold;
		threshSlider.onchange();
		weightSlider.value       = item.weight;
		weightLabel.innerText    = item.weight;
		weightSlider.onchange();
		input_border.checked     = item.input_border;
		input_border.onclick();
		pseudoAB.checked         = item.pseudoAB;
		pseudoAB.onclick();
		forceOpacity.checked     = item.forceOpacity;
		forceOpacity.onclick();
		makeCaps.checked         = item.makeCaps;
		makeCaps.onclick();
		normalInc2.checked       = item.normalInc2;
		normalInc2.onclick();
		start3.checked           = item.start3;
		start3.onclick();
		skipLinks.checked        = item.skipLinks;
		skipLinks.onclick();
		skipNavSection.checked   = item.skipNavSection;
		skipNavSection.onclick();
		skipColoreds.checked     = item.skipColoreds;
		skipColoreds.onclick();
		skipHeights.checked      = item.skipHeights;
		skipHeights.onclick();
		underlineLinks.checked   = item.underlineLinks;
		underlineLinks.onclick();
		global_css.value         = item.globalCss;
		}

		});
		};
		})(f);
		reader.readAsText(f);
		}
	};
	}
  
  	if (doc.getElementById("writeb") !== null) {
	doc.getElementById("writeb").onclick = () => {
		let link = doc.createElement("a");
		let file = new Blob([JSON.stringify(bl)], { type: 'text/plain' });
		link.href = URL.createObjectURL(file);
		link.download = "blacklist.json";
		link.click();
		URL.revokeObjectURL(link.href);
		link.remove();
	};
	}

	if (doc.getElementById("readb") !== null) {
	doc.getElementById("readb").onclick = () => {
		let fileSelector = doc.getElementById('fileselectorb');
		fileSelector.addEventListener('change', (event) => { fileListb = event.target.files; });
		if (typeof fileListb[0] != 'undefined') {
		let f = fileListb[0];
		var reader = new FileReader();
		reader.onload = (function(theFile) {
		return function(e) {
		let JsonObj = JSON.parse(e.target.result);
		var items;
		var item;
		chrome.storage.local.set({'blacklist': JsonObj});
		chrome.storage.local.get('blacklist', items => {
		let list = Array.from(items.blacklist);
		for(item of list)
			addRow(item, false);
		});
		};
		})(f);
		reader.readAsText(f);
		location.reload();
		}
	};
	}

	if (strSlider !== null) {
	strSlider.oninput = () => {
		strLabel.innerText = strSlider.value;
	};
	}

	if (sizeSlider !== null) {
	sizeSlider.oninput = () => {
		sizeLabel.innerText = sizeSlider.value;
	};
	}

	if (threshSlider !== null) {
	threshSlider.oninput = () => {
		threshLabel.innerText = threshSlider.value;
	};
	}

	if (weightSlider !== null) {
	weightSlider.oninput = () => {
		weightLabel.innerText = weightSlider.value;
	};
	}

	if (strSlider !== null) {
	strSlider.onchange = () => {
		chrome.storage.local.set({"globalStr": strSlider.value});
	};
	}

	if (sizeSlider !== null) {
	sizeSlider.onchange = () => {
		chrome.storage.local.set({"size": sizeSlider.value});
	};
	}

	if (weightSlider !== null) {
	weightSlider.onchange = () => {
		chrome.storage.local.set({"weight": weightSlider.value});
	};
	}

	if (threshSlider !== null) {
	threshSlider.onchange = () => {
		chrome.storage.local.set({"sizeThreshold": threshSlider.value});
	};
	}

	if (global_css !== null) {
	global_css.onchange = () => {
    		chrome.storage.local.set({"globalCss": global_css.value});
	}
	}
}

function saveURL(is_wl)
{
	let list_name;
	let list;
	let textarea;

	if (is_wl) {
		list = wl;
		list_name = 'whitelist';
		textarea = WLtextarea;
	} else {
		list = bl;
		list_name = 'blacklist';
		textarea = BLtextarea;
	}

	let url = textarea.value;
	url = url.trim();

	if (!isInputValid(url, list, is_wl)) {
		return;
		}

	let new_item;

	if (is_wl) {
		new_item = {
			url: url,
			strength: strSlider.value,
			size: sizeSlider.value
		}
	} else {
		new_item = { url: url };
	}

	list.push(new_item);

	chrome.storage.local.set({[list_name]: list});

	addRow(new_item, is_wl);
}

function isInputValid(url, list, is_wl)
{
	let list_name;

	if (is_wl)
		list_name = 'whitelist';
	else
		list_name = 'blacklist';

	if (url.length < 3) {
		message("Input is too short.", is_wl);
		return false;
	}
	else if (url.length > 512) {
		message("Exceeded limit of 512 characters.", is_wl);
		return false;
	}

	if (list.length > 1024) {
		message('Exceeded limit of 1024 items.', is_wl);
		return false;
	}

	if (list.find(o => o.url === url)) {
		message("It's already there.", is_wl);
		return false;
	}

	return true;
}

function reset(is_wl)
{
	if (is_wl) {
		chrome.storage.local.remove('whitelist');
		wl = [];
		WLtbody.innerHTML = "";
	}
	else {
		chrome.storage.local.remove('blacklist');
		bl = [];
		BLtbody.innerHTML = "";
	}
}

function message(msg, is_wl)
{
	let elem;

	if (is_wl)
		elem = doc.querySelector('#msg');
	else
		elem = doc.querySelector('#BLmsg');

	elem.innerText = msg;

	setTimeout(() => { elem.innerText = ''; }, 3000);
}

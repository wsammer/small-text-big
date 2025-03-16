"use strict";

let u_fullstop = /[\u0021\u002E\u003F\u0589\u061F\u06D4\u0700\u0701\u0702\u07F9\u0964\u0965\u104A\u104B\u1362\u1367\u1368\u166E\u1803\u1809\u1944\u1945\u1AA8\u1AA9\u1AAA\u1AAB\u1B5A\u1B5B\u1B5E\u1B5F\u1C3B\u1C3C\u1C7E\u1C7F\u203C\u203D\u2047\u2048\u2049\u2E2E\u3002\uA4FF\uA60E\uA60F\uA6F3\uA6F7\uA876\uA877\uA8CE\uA8CF\uA92F\uA9C8\uA9C9\uAA5D\uAA5E\uAA5F\uAAF0\uAAF1\uABEB\uFE52\uFE56\uFE57\uFF01\uFF0E\uFF1F\uFF61]+/umg;
var g_sp_timeout;
var g_sp_paused;
function speechResume() {
if (g_sp_paused != true) {
window.speechSynthesis.pause();
window.speechSynthesis.resume();
}
g_sp_timeout = setTimeout(speechResume,10000);
}
function speechToggle() {
if (g_sp_paused == true) {
g_sp_paused = false;
window.speechSynthesis.resume();
} else {
g_sp_paused = true;
window.speechSynthesis.pause();
}
}
function speakText(tex, stop, callback) {
if (stop) { window.speechSynthesis.cancel(); g_sp_timeout = setTimeout(speechResume,10000); return; }
var textlines = tex.split(u_fullstop);
for (var i= 0; i < textlines.length; i++) {
if (textlines[i].match(/\s+/g))
	textlines[i] = textlines[i].replaceAll(/\W+/g,' ');
var u = new SpeechSynthesisUtterance();
u.text = textlines[i];
u.lang = g_speech_language;

u.onend = function () {
clearTimeout(g_sp_timeout);
if (callback) {
    callback();
}
};

u.onerror = function (e) {
if (callback) {
    callback(e);
}
};
setTimeout(speechSynthesis.speak(u), 10);
}
}

function calcBrightness([r, g, b, a = 1])
{
	return (0.299*r + 0.587*g + 0.114*b)*a;
}

function calcColorfulness([r, g, b, a = 1])
{
	let max = Math.max(r,g,b);
	let min = Math.min(r,g,b);
	if (max == 0) return 0;
	return a*((max + min)*(max - min))/max;
}

function colorblindBg(col, cfg) {
	let cmin = Math.min(col[0],col[1],col[2]);
	let cmax = Math.max(col[0],col[1],col[2]);
	let pcol = '';
	if (finalLightness < 0.5 && cmax != col[2]) {
		if (col[0] >= col[1]) {
			let blu = col[2];
			col[2] = col[0];
			col[0] = blu;
			pcol = 'rgba('+col+')';
		} else if (col[1] > col[0]) {
			let blu = col[2];
			col[2] = col[1];
			col[1] = blu;
			pcol = 'rgba('+col+')';
		}
	} else if (finalLightness > 0.5 && cmax != col[2]) {
		if (col[0] > col[1]) {
			let blu = col[2];
			col[2] = col[0];
			col[0] = blu;
			pcol = 'rgba('+col+')';
		} else if (col[1] > col[0]) {
			let blu = col[2];
			col[2] = col[1];
			col[1] = blu;
			pcol = 'rgba('+col+')';
		}
	}
	return pcol;
}

function colorblindFg(col, cfg) {
	let cmin = Math.min(col[0],col[1],col[2]);
	let cmax = Math.max(col[0],col[1],col[2]);
	let pcol = '';
	if (finalLightness < 0.5 && cmax != col[1]) {
		if (col[2] >= col[0]) {
			let blu = col[1];
			col[1] = col[2];
			col[2] = blu;
			pcol = 'rgba('+col+')';
		} else if (col[0] > col[2]) {
			let blu = col[1];
			col[1] = col[0];
			col[0] = blu;
			pcol = 'rgba('+col+')';
		}
	} else if (finalLightness > 0.5 && cmax != col[2]) {
		if (col[0] > col[1]) {
			let blu = col[2];
			col[2] = col[0];
			col[0] = blu;
			pcol = 'rgba('+col+')';
		} else if (col[1] > col[0]) {
			let blu = col[2];
			col[2] = col[1];
			col[1] = blu;
			pcol = 'rgba('+col+')';
		}
	}
	return pcol;
}

function getRGBarr(rgba_str)
{
	if (rgba_str.length < 5) return [0,0,0,0];
//		let x = rgba_str.indexOf(')');
	let rgb = rgba_str.match(/[\.\d]+/g);
	rgb[3] = rgb[3] == undefined ? 1 : rgb[3];
	return rgb;
}

var style_node;
var css_node;
var doc_obs;
let b_html = false;
let f_sizes = [];
let f2_sizes = [];
let h_sizes = [];
let g_eng = false;
var str_style;
var str_style2 = '1';
var t_start, t_end;
var root_style;
var finalLightness;
let g_nokinput = /(checkbox|color|hidden|image|radio|range|submit)/i;
let g_okinput = /(date|email|month|number|password|search|select|tel|text|time|url|week)/i;
let g_mag = '';
let g_fntRule = false;
var g_globalCss;
var g_url;
var g_foot_re;
var g_zoom_keycode;
var g_lightness;
var g_zoom_padding;
var g_max_child;
var g_max_css_rules;
var g_start3_caps;
var g_speech_language;
var g_continue_speech;
var g_smaller_text;
var g_bg_threshold;
var g_min_colorfulness;
var g_site_reminder;

const focalAnchors = {};
focalAnchors.attrNameContainer = 'f-a-h';

focalAnchors.attrNameHighlight = 'f-a-i';

focalAnchors.classNameHighlight = 'f-a';

focalAnchors.toggleAnchorsById = function (id) {
	focalAnchors.toggleAnchorsByRef(document.getElementById(id));
}

focalAnchors.toggleAnchorsByRef = function (container, emoji = false, skiplinks = false, weight = 400) {
	if (container instanceof Element && container.hasAttribute(focalAnchors.attrNameContainer)) {
		focalAnchors.clearAnchors(container, emoji, skiplinks, weight);
	} else {
		focalAnchors.addAnchorsToContainer(container, emoji, skiplinks, weight);
	}
}

focalAnchors.clearAnchors = function (container, emoji, skiplinks, weight) {
const stack = [container];
while (stack.length > 0) {
	const topElement = stack.pop();
	topElement.removeAttribute(focalAnchors.attrNameContainer);
	Array.from(topElement.childNodes).forEach(node => {
		if (node.nodeType !== Node.TEXT_NODE && node instanceof Element) {
			if (node.hasAttribute(focalAnchors.attrNameContainer)) {
				stack.push(node);
			}
			if (node.hasAttribute(focalAnchors.attrNameHighlight)) {
				const prev = node.previousSibling;
				const next = node.nextSibling;
				if (prev !== null && prev.nodeType === Node.TEXT_NODE) {
				// Merge with previous node.
				prev.textContent += node.textContent;
				if (next.nodeType === Node.TEXT_NODE) {
				// Merge with next node.
				prev.textContent += next.textContent;
				node.parentNode.removeChild(next);
				}
				} else if (next !== null && next.nodeType === Node.TEXT_NODE) {
				next.textContent = node.textContent + next.textContent;
				} else {
				// If there are no adjacent text nodes, just insert.
				node.parentNode.insertBefore(document.createTextNode(node.textContent), node);
				}
				node.parentNode.removeChild(node);
			}
		}
	})
}
}

// Add anchors to children of container, recursively.
focalAnchors.addAnchorsToContainer = function (container, emoji, skiplinks, weight) {
	const stack = [container];
	while (stack.length > 0) {
		const topElement = stack.pop();
		Array.from(topElement.childNodes).forEach(node => {
			if (node.nodeType === Node.TEXT_NODE && node.textContent.length > 0 && !/(SCRIPT|STYLE)/i.test(node.parentNode.nodeName) && ((skiplinks && node.parentNode.nodeName.toUpperCase() != 'UL' && node.parentNode.nodeName.toUpperCase() != 'A') || !skiplinks) && ((emoji && /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/umg.test(node.textContent)) || !emoji)) {
				node.parentNode.setAttribute(focalAnchors.attrNameContainer, '');
				focalAnchors.injectAnchorText(node,weight);
				g_s3_prev = node.nodeName;
				node.parentNode.removeChild(node);
			} else {
				if (node instanceof Element && !node.hasAttribute(focalAnchors.attrNameContainer)) {
				stack.push(node);
				g_s3_prev = node.nodeName;
			}
			}
		});
	}
}

const mtrIndic = [ 2304, 2305, 2306, 2307, 2362, 2363, 2364, 2365, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2384, 2385, 2386, 2387, 2388, 2389, 2390, 2391, 2402, 2403, 2433, 2434, 2435, 2492, 2493, 2494, 2495, 2496, 2497, 2498, 2499, 2500, 2501, 2502, 2503, 2504, 2505, 2506, 2507, 2508, 2509, 2510, 2511, 2512, 2513, 2514, 2515, 2516, 2517, 2518, 2519, 2530, 2531, 2558, 2689, 2690, 2691, 2750, 2751, 2752, 2753, 2754, 2755, 2756, 2757, 2758, 2759, 2760, 2761, 2762, 2763, 2764, 2765, 2786, 2787, 2810, 2811, 2812, 2813, 2814, 2815, 2561, 2562, 2563, 2620, 2621, 2622, 2623, 2624, 2625, 2626, 2627, 2628, 2629, 2630, 2631, 2632, 2633, 2634, 2635, 2636, 2637, 2638, 2639, 2640, 2641, 2672, 2673, 2677, 3200, 3201, 3202, 3203, 3260, 3261, 3262, 3263, 3264, 3265, 3266, 3267, 3268, 3269, 3270, 3271, 3272, 3273, 3274, 3275, 3276, 3277, 3278, 3279, 3280, 3281, 3282, 3283, 3284, 3285, 3286, 3298, 3299, 3328, 3329, 3330, 3331, 3387, 3388, 3389, 3390, 3391, 3392, 3393, 3394, 3395, 3396, 3397, 3398, 3399, 3400, 3401, 3402, 3403, 3404, 3405, 3406, 3426, 3427, 2817, 2818, 2819, 2876, 2877, 2878, 2879, 2880, 2881, 2882, 2883, 2884, 2885, 2886, 2887, 2888, 2889, 2890, 2891, 2892, 2893, 2894, 2895, 2896, 2897, 2898, 2899, 2900, 2901, 2902, 2903, 2946, 2947, 3006, 3007, 3008, 3009, 3010, 3011, 3012, 3013, 3014, 3015, 3016, 3017, 3018, 3019, 3020, 3021, 3022, 3023, 3024, 3025, 3026, 3027, 3028, 3029, 3030, 3031, 3072, 3073, 3074, 3075, 3076, 3134, 3135, 3136, 3137, 3138, 3139, 3140, 3141, 3142, 3143, 3144, 3145, 3146, 3147, 3148, 3149, 3150, 3151, 3152, 3153, 3154, 3155, 3156, 3157, 3158, 3170, 3171 ];

var g_s3_prev;
let g_s3_reg = /^(a|b|del|em|i|ins|li|mark|small|strong|sub|sup)$/i;
focalAnchors.injectAnchorText = function (node,weight) {
	if (node instanceof Element && node.hasAttribute(focalAnchors.attrNameContainer)) return;
	let txtc = node.textContent;
	var tag = '';
	var wt = parseInt(weight)+400;
	if (node.parentNode) tag = node.parentNode.nodeName;
	if (g_eng) {
	let words = txtc.split(/\b/);
	let caps = g_start3_caps;
	let sty = g_start3_caps;
	const spann = document.createElement('span');
	for (let wordID = 0; wordID < words.length; wordID++) {
		if (words[wordID] == undefined || words[wordID] == null) continue;
		if (!/(CODE|PRE)/i.test(tag) && (words[wordID].search(/\n\t+/) != -1 || words[wordID].search(/\n+\ /) != -1)) 
			if ((wordID > 0 && words[wordID-1].search(/\s/mg) != -1) || (wordID == 0 && words.length == 1))
			continue;
		let word = words[wordID];
		var boldNum, spos;
		const bold = document.createElement('b');
		if (g_start3_caps.substr(0,4).indexOf('line') > -1) {
		if (g_s3_reg.test(g_s3_prev) || g_s3_reg.test(node.parentNode.nodeName)) {
			if (g_s3_reg.test(g_s3_prev) && wordID > 0 && u_fullstop.test(words[wordID-1])) {
			spos = words[wordID].search(/\w/);
			boldNum = 1;
			caps = 'text-transform:uppercase!important;'+sty;
			} else {
			boldNum = 0;
			}
		} else if (wordID > 0 && u_fullstop.test(words[wordID-1])) {
			spos = words[wordID].search(/\w/);
			boldNum = 1;
			caps = 'text-transform:uppercase!important;'+sty;
		} else if (/\w/.test(words[0]) && wordID == 0) {
			spos = words[0].search(/\w/);
			boldNum = 1;
			caps = 'text-transform:uppercase!important;'+sty;
		} else if (!/\w/.test(words[0]) && wordID == 1) {
			spos = words[1].search(/\w/);
			boldNum = 1;
			caps = 'text-transform:uppercase!important;'+sty;
		} else {
			boldNum = 0;
		}
		} else if (g_start3_caps.substr(0,4).indexOf('para') > -1) {
		if (g_s3_reg.test(g_s3_prev) || g_s3_reg.test(node.parentNode.nodeName)) {
			boldNum = 0;
		} else if (/\w/.test(words[0]) && wordID == 0) {
			spos = words[0].search(/\w/);
			boldNum = 1;
			caps = 'text-transform:uppercase!important;'+sty;
		} else if (!/\w/.test(words[0]) && wordID == 1) {
			spos = words[1].search(/\w/);
			boldNum = 1;
			caps = 'text-transform:uppercase!important;'+sty;
		} else {
			boldNum = 0;
		}
		} else {
			spos = 0;
			boldNum = Math.min(word.length,3);
		}
		if (boldNum > 0) {
		if (weight <= 400)
			bold.setAttribute('style', caps+'font-weight:'+wt+'!important');
		else
			bold.setAttribute('style', caps+'font-weight:'+weight+'!important');
		bold.setAttribute(focalAnchors.attrNameHighlight, '');
		bold.textContent = word.substring(spos, boldNum);
		node.parentNode.insertBefore(bold, node);
		}
		node.parentNode.insertBefore(document.createTextNode(word.substr(boldNum)), node);
	}
	if (node.textContent.replaceAll(/\s+/mg,'').length > 1) {
	node.parentNode.appendChild(spann);
	spann.appendChild(node);
	}
	words.length = 0;
	} else {
	let words = txtc.split(' ');
	let sCaps = g_start3_caps;
	let sty = g_start3_caps;
	const spann = document.createElement('span');
	for (let wordID = 0; wordID < words.length; wordID++) {
		if (words[wordID] == undefined || words[wordID] == null || words[wordID].length == 0) continue;
		if (!/(CODE|PRE)/i.test(tag) && words[wordID].replaceAll(/\s/g,'').length == 0 && (words[wordID].search(/\n+\t*/) != -1 || words[wordID].search(/\n+\ /) != -1)) continue;
		let word = words[wordID];
		var boldNum, spos;
		const bold = document.createElement('b');
		if (g_start3_caps.substr(0,4).indexOf('line') > -1) {
		if (g_s3_reg.test(g_s3_prev) || g_s3_reg.test(node.parentNode.nodeName)) {
			if (g_s3_reg.test(g_s3_prev) && wordID > 0 && u_fullstop.test(words[wordID-1])) {
			spos = words[wordID].search(/\p{L}/gu);
			boldNum = 1;
			sCaps = 'text-transform:uppercase!important;'+sty;
			} else {
			boldNum = 0;
			}
		} else if (wordID > 0 && u_fullstop.test(words[wordID-1])) {
			spos = words[wordID].search(/\p{L}/gu);
			boldNum = 1;
			sCaps = 'text-transform:uppercase!important;'+sty;
		} else if (words[0].search(/\p{L}/gu) > -1 && wordID == 0) {
			spos = words[0].search(/\p{L}/gu);
			boldNum = 1;
			sCaps = 'text-transform:uppercase!important;'+sty;
		} else if (words[0].search(/\p{L}/gu) < 0 && wordID == 1) {
			spos = words[1].search(/\p{L}/gu);
			boldNum = 1;
			sCaps = 'text-transform:uppercase!important;'+sty;
		} else {
			boldNum = 0;
		}
		} else if (g_start3_caps.substr(0,4).indexOf('para') > -1) {
		if (g_s3_reg.test(g_s3_prev) || g_s3_reg.test(node.parentNode.nodeName)) {
			boldNum = 0;
		} else if (words[0].search(/\p{L}/gu) > -1 && wordID == 0) {
			spos = words[0].search(/\p{L}/gu);
			boldNum = 1;
			sCaps = 'text-transform:uppercase!important;'+sty;
		} else if (words[0].search(/\p{L}/gu) < 0 && wordID == 1) {
			spos = words[1].search(/\p{L}/gu);
			boldNum = 1;
			sCaps = 'text-transform:uppercase!important;'+sty;
		} else {
			boldNum = 0;
		}
		} else {
			spos = 0;
			boldNum = Math.min(word.length,3);
		}
		if (boldNum > 0) {
		if (mtrIndic.includes(word.charCodeAt(2)) || mtrIndic.includes(word.charCodeAt(3)) || mtrIndic.includes(word.charCodeAt(4)) || mtrIndic.includes(word.charCodeAt(5))) {
			if (mtrIndic.includes(word.charCodeAt(2))) boldNum =Math.min(word.length,4);
			if (mtrIndic.includes(word.charCodeAt(3))) boldNum =Math.min(word.length,5);
			if (mtrIndic.includes(word.charCodeAt(4))) boldNum =Math.min(word.length,6);
			if (mtrIndic.includes(word.charCodeAt(5))) boldNum =Math.min(word.length,7);
		}
		if (mtrIndic.includes(word.charCodeAt(boldNum)) && boldNum+1 <= word.length) boldNum++;
		if (mtrIndic.includes(word.charCodeAt(boldNum)) && boldNum+1 <= word.length) boldNum++;
		if (weight <= 400)
			bold.setAttribute('style', sCaps+'font-weight:'+wt+'!important');
		else
			bold.setAttribute('style', sCaps+'font-weight:'+weight+'!important');
		bold.setAttribute(focalAnchors.attrNameHighlight, '');
		bold.textContent = word.substr(spos, boldNum);
		node.parentNode.insertBefore(bold, node);
		}
		node.parentNode.insertBefore(document.createTextNode(word.substr(boldNum)+ '\u0020'), node);
	}
	if (node.textContent.replaceAll(/\s+/mg,'').length > 1) {
	node.parentNode.appendChild(spann);
	spann.appendChild(node);
	}
	words.length = 0;
	}
}

function getVarValue(va) {
	var b = '';
	if (va.substr(0,4).indexOf('var(') > -1) {
		if (va.indexOf(',') > -1)
			b = va.replace(/var\(([^,]*?),.*/i, `$1`);
		else
			b = va.replace(/var\((.*?)\)/i, `$1`);
		return root_style.getPropertyValue(b);
	} else {
		return '';
	}
}

async function waitForImage(im) {
return new Promise((res, rej) => {
if (im.complete) {
return res();
}
im.onload = () => res();
im.onerror = () => res();
});
}

async function isImage(ch, nc, imar, gcs, b_imgforce) {
	if (!(ch instanceof Element)) return false;
	if (b_imgforce[nc] != true) b_imgforce[nc] = false;
	var wi,he;
	let bgim = gcs.backgroundImage ? gcs.backgroundImage : '';
	let chsrc = ch.src ? ch.src : '';
	let itag = ch.nodeName.toUpperCase();
	switch (itag) {
	case 'IMG':
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && ch.getAttribute('loading') != 'lazy')
			return false;
		wi = parseInt(ch.width);
		he = parseInt(ch.height);
		if (!wi && !he) {
		wi = parseInt(parseInt(ch.getBoundingClientRect().width)/10);
		he = parseInt(parseInt(ch.getBoundingClientRect().height)/10);
		}
		imar[nc] = wi*he;
		if (wi > 499 && he > 99) b_imgforce[nc] = true;
		return true;
	case'SVG':
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && ch.getAttribute('loading') != 'lazy')
			return false;
		wi = parseInt(parseInt(ch.getBoundingClientRect().width)/10);
		he = parseInt(parseInt(ch.getBoundingClientRect().height)/10);
		imar[nc] = wi*he;
		if (wi > 499 && he > 99) b_imgforce[nc] = true;
		return true;
	case 'VIDEO':
	case 'EMBED':
	case 'OBJECT':
	case 'CANVAS':
	case 'PICTURE':
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && ch.getAttribute('loading') != 'lazy')
			return false;
		wi = parseInt(ch.width);
		he = parseInt(ch.height);
		if (!wi && !he) {
		wi = parseInt(parseInt(ch.getBoundingClientRect().width)/10);
		he = parseInt(parseInt(ch.getBoundingClientRect().height)/10);
		}
		imar[nc] = wi*he;
		return true;
	default:
	if ( gcs != null && bgim != '' && bgim != 'none' && gcs.getPropertyValue('display') != 'none' && !/(aspx?|html?|php)[\"\'\)]/i.test(bgim) && /(\/|http|url)/ig.test(bgim)) {
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && ch.getAttribute('loading') != 'lazy')
			return false;
		var im, src, src1;
		if (/var\(/i.test(bgim))
			src1 = getVarValue(bgim);
		else
			src1 = bgim;
                im = new Image();
                src = src1.replace(/url\((['"])?(.*?)\1\)/gi, '$2');
		im.src = src;
		await waitForImage(im);
		wi = parseInt(im.width);
		he = parseInt(im.height);
		if (/\.svg/i.test(src) && !wi && !he) {
		wi = parseInt(parseInt(ch.getBoundingClientRect().width));
		he = parseInt(parseInt(ch.getBoundingClientRect().height));
		} else if (!wi && !he) {
		wi = parseInt(parseInt(ch.getBoundingClientRect().width)/10);
		he = parseInt(parseInt(ch.getBoundingClientRect().height)/10);
		}
		imar[nc] = wi*he;
		if (wi > 499 && he > 99) b_imgforce[nc] = true;
		if ((wi > 0 && he > 0) || (wi == 0 && he == 0)) {
			return true;
		} else {
			return false;
		}
	} else if (chsrc != undefined && chsrc && ch.display != 'none' && ch.type != null && ch.type != undefined && ch.type.toLowerCase() == 'image' && !/(aspx?|html?|php)[\"\'\)]/i.test(chsrc) && !/(aspx?|html?|php)[\"\'\)]/i.test(bgim)  && (/(\/|http|url)/ig.test(chsrc))) {
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && ch.getAttribute('loading') != 'lazy')
			return false;
		var im, src, src1;
                im = new Image();
		if (/var\(/i.test(bgim))
			src1 = getVarValue(chsrc);
		else
			src1 = chsrc;
                src = src1.replace(/url\((['"])?(.*?)\1\)/gi, '$2');
		im.src = src;
		await waitForImage(im);
		wi = parseInt(im.width);
		he = parseInt(im.height);
		if (!wi && !he) {
		wi = parseInt(parseInt(ch.getBoundingClientRect().width)/10);
		he = parseInt(parseInt(ch.getBoundingClientRect().height)/10);
		}
		imar[nc] = wi*he;
		if (wi > 499 && he > 99) b_imgforce[nc] = true;
		return true;
	} else {
		return false;
	}
	}
	return false;
}

function getTopNode(node) {
	let pch = node.parentNode;
	let c = node;
	while (pch && !/\b(BODY|HTML)/i.test(pch.nodeName)) {
		c = pch;
		pch = pch.parentNode;
	}
	return c;
}

function getCSS(cfg) {

	const attr = '[d__],[d__][style]';
	let color_black = 'color:black!important;';

	let dim = '';
	let sCaps = '';
	var brght,ctrst;

	let opacity = '';
	if (cfg.forceOpacity)
		opacity = 'opacity:1!important;';

	let boldw = cfg.weight;
	let bold = '';
	if (!(cfg.skipLinks && !cfg.start3))
	if (!cfg.start3 || boldw < 400)
	if (boldw != 400)
		bold = `*{font-weight:${boldw}!important};`;

	let underline = '';
	if (cfg.underlineLinks)
		underline = '[u__]{text-decoration:underline!important}';

	if (cfg.makeCaps)
		sCaps = 'font-variant-caps:small-caps!important;';

	const placeholder = `::placeholder{opacity:1!important;${color_black}};`;

	let form_border = '';
	if (cfg.input_border)
		form_border = '[b__]{border:1px solid black!important}';

	let cust = '';
	if (cfg.customCss)
		cust = cfg.customCssText;

	let size_inc = '';
//	let c = cfg.threshold;
//	let cc = parseInt(c) + parseFloat(cfg.size/c);
//	let height_inc = parseFloat(cfg.size/c)/parseFloat(cfg.size);
	let c = 0, cd = 0;
	let cc = 0;
	let height_inc = 1;
	var pcent;

	let n_zoo = Math.abs(parseFloat(cfg.strength)/100).toFixed(2);
	if (cfg.customCss && /\-\-g_zoom[\W\:]+/.test(cust)) {
		let cs = cust;
		cs = cs.replace(/[\w\W]*g_zoom[\W\:]+([0-9\.]+)[\w\W]*/g,`$1`);
		n_zoo = parseFloat(cs);
	} else if (cfg.globalCss != undefined && cfg.globalCss && /\-\-g_zoom[\W\:]+/.test(cfg.globalCss)) {
		let cs = cfg.globalCss;
		cs = cs.replace(/[\w\W]*g_zoom[\W\:]+([0-9\.]+)[\w\W]*/g,`$1`);
		n_zoo = parseFloat(cs);	
	} else if (cfg.strength == 0) {
		n_zoo = 1.75;
	}

	document.documentElement.style.setProperty('--g_zoom',n_zoo);

	g_mag = ".stbenlarge:hover { position: relative; overflow: visible;-webkit-transform: scale(var(--g_zoom));-moz-transform: scale(var(--g_zoom));-o-transform: scale(var(--g_zoom));-ms-transform: scale(var(--g_zoom));transform: scale(var(--g_zoom));-webkit-transition: all .2s ease-in-out;-moz-transition: all .2s ease-in-out;-o-transition: all .2s ease-in-out;-ms-transition: all .2s ease-in-out;z-index: 19999;} .stbenlarge {position: relative; overflow: hidden;z-index: 1000; }";

	g_smaller_text = false;
	if (cfg.customCss && cust.indexOf('--g_smaller_text') > -1) {
		if (!/\-\-g_smaller_text[^\;]*false\;/.test(cust))
			g_smaller_text = true;
		else
			g_smaller_text = false;
	} else if (cfg.globalCss != undefined && cfg.globalCss && cfg.globalCss.indexOf('--g_smaller_text') > -1) {
		if (!/\-\-g_smaller_text[^\;]*false\;/.test(cfg.globalCss))
			g_smaller_text = true;
		else
			g_smaller_text = false;
	}

	if (cfg.size > 0 && cfg.threshold > 0) {
		height_inc = (1.07 + 0.225*cfg.size/cfg.threshold).toFixed(2);
		while (c < cfg.threshold) {
			++c;
			cd = c;
			if (!cfg.start3 && cfg.skipLinks) {
				cc = (cfg.size*0.2) + (parseFloat(cfg.threshold*1.075) - (2*c/11))*(100+((cfg.weight+400) % 900))/900;
				pcent = Math.abs((2.5*cfg.size) - (c*20/cfg.threshold))*(100+((cfg.weight+400) % 900))/900;
			} else {
				cc = (cfg.size*0.2) + parseFloat(cfg.threshold*1.075) - (2*cd/11);
				pcent = Math.abs((2.5*cfg.size) - (cd*20/cfg.threshold));
			}
			if (parseFloat(cc) < c && !g_smaller_text) { cc = c; }
			if (parseFloat(cc) > cfg.threshold) cc = cfg.threshold;
			let cc1 = parseInt(cc);
			var cc2;
			if (g_smaller_text)
				cc2 = (cc1*(1-0.5*parseFloat(pcent)/20)).toFixed(1);
			else
				cc2 = (cc1*(1+parseFloat(pcent)/100)).toFixed(1);
			size_inc += `[s__='${c}']{font-size: ${cc2}px!important;`;
			if (!cfg.skipHeights)
				size_inc += `line-height: ${height_inc}em!important;${sCaps}${opacity}}\n`;
			else
				size_inc += `${sCaps}${opacity}}\n`;
			size_inc += `[h__='${c}']{line-height:115%!important;min-height: ${height_inc}em!important}`;
			if (!cfg.skipHeights)
				f_sizes[c] = "font-size: " + cc2 + "px!important;"+sCaps+"line-height: " + height_inc + "em!important;" + opacity;
			else
				f_sizes[c] = "font-size: " + cc2 + "px!important;"+sCaps+ opacity;
			h_sizes[c] = `${height_inc}em`;
			if (cc2.substr(-2,2).indexOf('.0') > -1) cc2 = parseInt(cc2);
			f2_sizes[c] = cc2 + "px";
		}
	}
	str_style2 = '1';

	g_globalCss = '';
	if (cfg.globalCss != undefined && cfg.globalCss)
		g_globalCss = cfg.globalCss;

	return `${bold}${size_inc}${g_mag}${form_border}${underline}${g_globalCss}${cust}`;
}

function createElem()
{
	let doc = document;

	style_node = doc.createElement('style');
	style_node.setAttribute('id', '_stb_');
	let d_head = doc.head || doc.getElementsByTagName('HEAD')[0];
	if (d_head != undefined && d_head != null)
		d_head.appendChild(style_node);
	else
		d_head = '';

	css_node = doc.createTextNode('');
}

async function init()
{
	if (document.getElementById('_stb_')) return;

	t_start = Date.now();

	createElem();

	let stored = [
		'enableEverywhere',
		'whitelist',
		'blacklist',
		'globalStr',
		'strength',
		'size',
		'sizeThreshold',
		'weight',
		'forceOpacity',
		'pseudoAB',
		'makeCaps',
		'normalInc2',
		'start3',
		'skipLinks',
		'skipNavSection',
		'skipColoreds',
		'skipHeights',
		'underlineLinks',
		'input_border',
		'fontFamily',
		'fontFamilyName',
		'customCss',
		'customCssText',
		'globalCss'
	];

	let cfg = await new Promise(res => chrome.storage.local.get(stored, res));

	cfg.threshold = cfg.sizeThreshold;
	cfg.strength  = cfg.globalStr;

	let url = window.location.hostname || window.location.href;
	g_url = url.trim();

	if (window.self != window.top) {
		let fr = document.getElementsByTagName('HTML')[0];
		if (fr && fr != undefined && (parseInt(fr.getBoundingClientRect().height) < 10 || parseInt(fr.getBoundingClientRect().width) < 10)) return;
	}

	let bl  = cfg.blacklist || [];
	let idx = bl.findIndex(x => x.url === url);

	if (idx > -1) {
		let cnode = document.getElementById("_stb_");
		if (style_node.hasChildNodes()) {
			style_node.removeChild(cnode);
		}
		cnode.remove();
		return;
	}

	let wl  = cfg.whitelist || [];
	idx = wl.findIndex(x => x.url === window.location.href);

	let g_css = cfg.globalCss;
	if (idx > -1) {
		cfg = wl[idx];
	} else {
		idx = wl.findIndex(x => x.url === url);
		if (idx > -1) {
			cfg = wl[idx];
		} else if (!cfg.enableEverywhere) {
			let cnode = document.getElementById("_stb_");
			cnode.remove();
			return;
		}
	}
	cfg.globalCss = g_css;

	start(cfg);
}

async function start(cfg, url)
{
	css_node.nodeValue = getCSS(cfg);

/**	for (let s of document.getElementsByTagName('STYLE')) {
		css_node.nodeValue += s.innerHTML;
	}*/

	let nodes = [];

	if (document.body)
		nodes = Array.from(document.body.getElementsByTagName('*'));
	else
		return;

	let tags_to_skip = [
		'SCRIPT',
		'LINK',
		'META',
		'STYLE',
		'VIDEO',
		'AUDIO',
		'SVG',
		'IMG',
		'PICTURE',
		'FIGURE',
		'EMBED',
		'OBJECT',
		'SOURCE',
		'CANVAS',
		'NOSCRIPT',
		'UNDEFINED'
	];

	let callcnt = 0;

	let b_ctext = {};
	let b_chimg = {};
	let b_iimg = {};
	let b_dim = {};
	let m_sty = {};
	let b_emo = {};
	let b_noemo = true;
	let b_idone = {};
	let b_cdone = {};
	let b_chk = {};
	let b_imgforce = {};
	let n_rulecount = 0;
	let images = [];
	let img_area = {};
	let map = new Map();
	let m_ss = {};
	let m_done = {};
	let nodes_behind_inv = [];
	let n_imgcount = 0;
	let b_csp = true;
	let b_forced = false;
	let nodes_to_skip = [];
	let nodes_to_observe = [];
	let str300 = cfg.strength == -300;
	root_style = getComputedStyle(document.documentElement);
	let rootsty = root_style;
	let browser_sfz = 'px';
	if (rootsty.fontSize && /\d.*?px/i.test(rootsty.fontSize))
		browser_sfz = rootsty.fontSize;
	let rootcolor       =  getRGBarr(rootsty.backgroundColor);
	let bodycolor       =  getRGBarr(getComputedStyle(document.body).backgroundColor);
	if (rootcolor != '' && bodycolor != '') {
	let rootLightness   = 1 -  rootcolor[3] + rootcolor[3] * calcBrightness(rootcolor)/255;
	finalLightness  = Math.abs((1 - bodycolor[3]) * rootLightness + bodycolor[3] * calcBrightness(bodycolor)/255);
	finalLightness = Math.sqrt(finalLightness);
        if (window.self == window.top)
		chrome.storage.local.set({lightness: finalLightness, default_size: browser_sfz});
	console.log('Dark / Light = '+finalLightness.toFixed(2));
	}
	g_eng = false;
	var lang;
	if (cfg.start3 || cfg.makeCaps) {
		lang = document.documentElement.lang;
		if (lang == null || lang.length == 0)
			g_eng = true;
		else if (/^en/i.test(lang))
			g_eng = true;
	} else {
		g_eng = true;
	}

	if (cfg.pseudoAB)
		css_node.nodeValue += "._stbfontb_:before,._stbfonta_:after { font-size:"+cfg.threshold+"px !important; }";

	style_node.appendChild(css_node);

	if ((cfg.customCss && cfg.customCssText) || g_globalCss) {

	let docs = getComputedStyle(document.documentElement);

	g_zoom_keycode = docs.getPropertyValue('--g_zoom_keycode');
	if (!g_zoom_keycode || g_zoom_keycode == undefined)
		g_zoom_keycode = 16;

	g_max_child = docs.getPropertyValue('--g_max_child');
	if (!g_max_child || g_max_child == undefined)
		g_max_child = 8;

	g_zoom_padding = docs.getPropertyValue('--g_zoom_padding');
	if (!g_zoom_padding || g_zoom_padding == undefined)
		g_zoom_padding = '0% 15% 0% 15%';

	g_max_css_rules = docs.getPropertyValue('--g_max_css_rules');
	if (!g_max_css_rules || g_max_css_rules == undefined)
		g_max_css_rules = 1000;

	g_lightness = docs.getPropertyValue('--g_lightness');
	if (!g_lightness || g_lightness == undefined)
		g_lightness = finalLightness;
	else
		finalLightness = g_lightness;

	g_start3_caps = docs.getPropertyValue('--g_start3_caps');
	if (!g_start3_caps || g_start3_caps == undefined || g_start3_caps == 'false')
		g_start3_caps = '';
	else
		if (/(line|para)/.test(g_start3_caps))
			g_start3_caps = g_start3_caps.replaceAll(/[\'\"]/g,'');
		else
			g_start3_caps = 'font-variant-caps:small-caps!important;';

	g_speech_language = docs.getPropertyValue('--g_speech_language');
	if (!g_speech_language || g_speech_language == undefined)
		g_speech_language = document.documentElement.lang;

	g_continue_speech = docs.getPropertyValue('--g_continue_speech');
	if (!g_continue_speech || g_continue_speech == undefined || g_continue_speech == 'false')
		g_continue_speech = false;
	else
		g_continue_speech = true;

	g_bg_threshold = docs.getPropertyValue('--g_bg_threshold');
	if (!g_bg_threshold || g_bg_threshold == undefined)
		g_bg_threshold = 160;

	g_min_colorfulness = docs.getPropertyValue('--g_min_colorfulness');
	if (!g_min_colorfulness || g_min_colorfulness == undefined)
		g_min_colorfulness = 41;

	g_site_reminder = docs.getPropertyValue('--g_site_reminder');
	if (!g_site_reminder || g_site_reminder == undefined)
		g_site_reminder = '';

	} else {
		g_zoom_keycode = 16;
		g_max_child = 8;
		g_zoom_padding = '0% 15% 0% 15%';
		g_max_css_rules = 1000;
		g_start3_caps = '';
		g_lightness = finalLightness;
		g_speech_language = document.documentElement.lang;
		g_continue_speech = false;
		g_bg_threshold = 160;
		g_min_colorfulness = 41;
		g_site_reminder = '';
	}

	if (g_site_reminder) {
		var txt,txt2;
		txt2 = g_site_reminder.replaceAll(/\\n/g,'\n');
		if (txt2[0] == "\'" || txt2[0] == '\"') txt = txt2.substr(1,txt2.length-2);
		alert('REMINDER for site : '+g_url+'\n\n'+txt+'\n\nTo remove this reminder, edit custom CSS of this site in Better Text View.');
	}

	var doc = document;
	let rn = 0;
	let b_sec = false;
	let body_nfz = 16;
	let b_bdone = false;
	let rul_arr = [];
	rul_arr[0] = [];
	rul_arr[1] = [];
	rul_arr[2] = [];
	if (browser_sfz) body_nfz = parseInt(browser_sfz);
	for (var si = 0; si < document.styleSheets.length; si++) {
		var sheet,rules;
		try {
		sheet = document.styleSheets[si];
		rules = sheet.cssRules;
		} catch (e) { continue; }
		try {
		let rl = rules.length;
		if (rl > g_max_css_rules) continue;
		let ri = 0;
		for (ri = 0; ri < rl; ri++) {
		b_sec = false;
		let rule= rules[ri];
		let fgr = '';
		let txtrul = '';
		let txtrul2 = '';
		if (rule.href) { rules = rule.styleSheet.cssRules; ri = 0; rl = rules.length;continue; }
		if (rule.selectorText && rule.style) {
		let key = rule.selectorText;
		let value = rule.style.cssText;
		if (g_foot_re && /footer/i.test(key)) continue;
		if (m_done[key] == undefined) m_done[key] = 0;
		if (/(\bbody|\bhtml|\[s__)/i.test(key) && b_bdone != true && cfg.threshold > 0 && cfg.size > 0 && rule.style.fontSize) {
			if (key.indexOf('[s__') > -1) continue;
			var rt, rt1;
			rt1 = rule.style.fontSize;
			if (/var\(/i.test(rt1))
				rt = getVarValue(rt1);
			else
				rt = rt1;
			if (/[\d\.]+.*?px/i.test(rt)) {
			let nfz = parseInt(rt);
			if (nfz <= cfg.threshold && nfz > 1) {
			txtrul = key+' { font-size: '+f2_sizes[nfz]+' !important; }';
			n_rulecount++;
			b_bdone = true;
			}
			}
		}
		if (m_done[key] < 3 && cfg.threshold > 0 && cfg.size > 0 && rule.style.fontSize) {
			m_done[key]++;
			var rt, rt1;
			rt1 = rule.style.fontSize;
			if (/var\(/i.test(rt1))
				rt = getVarValue(rt1);
			else
				rt = rt1;
			if (/[\d\.]+.*?px/i.test(rt)) {
			let nfz = parseInt(rt);
			if (nfz <= cfg.threshold && nfz > 1) {
			txtrul = key+' { '+f_sizes[nfz]+' }';
			n_rulecount++;
			}
			} else if (/[\d\.]+.*?rem/i.test(rt)) {
			let nfz = parseInt(parseFloat(rt)*body_nfz);
			if (nfz <= cfg.threshold && nfz > 1) {
			txtrul = key+' { '+f_sizes[nfz]+' }';
			n_rulecount++;
			}
			} else if (/[\d\.]+.*?pt/i.test(rt)) {
			let nfz = parseInt(parseFloat(rt)*1.333334);
			if (nfz <= cfg.threshold && nfz > 1) {
			txtrul = key+' { '+f_sizes[nfz]+' }';
			n_rulecount++;
			}
			}/* else if (/[\d\.]+.*?r?em/i.test(rt)) {
			let nfz = parseInt(parseFloat(rt)*body_nfz);
			if (nfz <= cfg.threshold && nfz > 1) {
			txtrul = key+' { '+f_sizes[nfz]+' }';
			n_rulecount++;
			}
			}*/
		}
		if (!txtrul && m_done[key] < 3 && cfg.threshold > 0 && cfg.size > 0 && rule.style.fontSize) {
				m_done[key]++;
				var rt,rt1;
				rt1 = rule.style.fontsize;
				if (/var\(/i.test(rt1))
					rt = getVarValue(rt1);
				else
					rt = rt1;
				if (/\d+.*?px/i.test(rt)) {
				let fsz = parseInt(rt);
				if (fsz > 1 && fsz <= cfg.threshold) {
					txtrul = key + ' { ' + f_sizes[fsz] + ' }';
					}
				}
		}
		}
		if (!b_sec && txtrul) {
			style_node.sheet.insertRule(txtrul, 0);
			b_sec = false;
		}

		}
		} catch (error) {
			console.log('cssrules security   !');
			console.log(error);
			b_sec = true;
		}
	}
	if (n_rulecount < 3) n_rulecount = 0;

	if (!cfg.fontFamilyName || !cfg.fontFamily) {
		let rul = 'var(--g_stbfont)';
		if (style_node.sheet != undefined) {
		let rl = style_node.sheet.cssRules;
		let x = 0;
		for (x = 0; x < rl.length; x++ )
			if (rl[x].cssText.indexOf(rul) > -1) break;
		if (x < rl.length)
			style_node.sheet.deleteRule(x);
		}
	} else {
		let fntFmly = `*{font-family:var(--g_stbfont)!important;}`;
		if (cfg.fontFamily) {
			document.documentElement.style.setProperty('--g_stbfont',cfg.fontFamilyName);
			g_fntRule = true;
		} else {
			fntFmly = '';
			document.documentElement.style.setProperty('--g_stbfont','');
			g_fntRule = false;
		}
		style_node.sheet.insertRule(fntFmly, 0);
	}

		var zoom_mode = false, orig_val = [], t_zoom = 0, t_zc = 0, l_z = [], orig_cursor = '';

			window.addEventListener("mousemove", mousemove);
			window.addEventListener("mouseover", mousemove);
			window.addEventListener("mouseenter", mousemove);
			window.addEventListener("mouseleave", mouseout);
			window.addEventListener("mouseout", mouseout);
			window.addEventListener("keyup", keyup);
			window.addEventListener("keydown", keydown);

			function keyup(e) {
				if (e.keyCode == g_zoom_keycode && e.getModifierState("NumLock")) {
					zoom_mode = false;
					t_zc = Date.now();
					document.documentElement.style.cursor = orig_cursor;
					if (g_continue_speech != true)
						speakText("",1);
				} else if (e.keyCode == 27 && e.getModifierState("NumLock")) {
					speechToggle();
				}
			}

			function keydown(e) {
				if (e.keyCode == g_zoom_keycode && e.getModifierState("NumLock")) {
					zoom_mode = true;
					t_zc = Date.now();
					if (!/zoom\-(in|out)/.test(document.documentElement.style.cursor)) {
						orig_cursor = document.documentElement.style.cursor;
						if (parseFloat(document.documentElement.style.getPropertyValue('--g_zoom')) > 1.0)
							document.documentElement.style.cursor = 'zoom-in';
						else
							document.documentElement.style.cursor = 'zoom-out';
					}
				}
			}

			function mousemove(e) {
				if (e.buttons == 0) {
				if (!zoom_mode) return;
				if (zoom_mode && Date.now() - t_zc > 10000) {
					zoom_mode = false;
					document.documentElement.style.cursor = orig_cursor;
					return;
				}
				let targ = getTarget(e);
				if (l_z.includes(targ)) return;
				let val = [];
				if (Date.now()-t_zoom > 260) {
				t_zoom = Date.now();
				let b_skip = false;
				val[0] = targ.className;
				val[2] = targ.style.textShadow;
				val[3] = targ.style.position;
				val[4] = targ.style.zIndex;
				val[1] = targ.style.transformOrigin;
				val[10] = targ.style.padding;
				val[12] = targ.style.border;
				val[5] = ''; val[6] = ''; val[7] = '';
				if (targ.parentNode && targ.parentNode.style) {
					val[5] = targ.parentNode.style.zIndex;
					if (targ.parentNode.getBoundingClientRect().width == targ.getBoundingClientRect().width) {
						targ.parentNode.style.zIndex = '9999999';
						if (targ.parentNode.parentNode && targ.parentNode.parentNode.style) {
							val[6] = targ.parentNode.parentNode.style.zIndex;
							if (targ.parentNode.parentNode.getBoundingClientRect().width == targ.getBoundingClientRect().width) { 
								targ.parentNode.parentNode.style.zIndex = '9999999';
								if (targ.parentNode.parentNode.parentNode && targ.parentNode.parentNode.parentNode.style) {
									val[7] = targ.parentNode.parentNode.parentNode.style.zIndex;
									if (targ.parentNode.parentNode.parentNode.getBoundingClientRect().width == targ.getBoundingClientRect().width) {
										targ.parentNode.parentNode.parentNode.style.zIndex = '9999999';
									}
								}
							}
						}
					}
				}
				let tnode = getTopNode(targ);
				let tnodes = Array.from(tnode.getElementsByTagName('*'));
				let idx = tnodes.findIndex(o => /stbenlarge/.test(o.className));
				if (idx > -1) b_skip = true;
				if (!b_skip) {
				orig_val.push(val);
				let nzo = parseFloat(document.documentElement.style.getPropertyValue('--g_zoom'));
				let gcs = getComputedStyle(targ);
				targ.style.zIndex = '99999';
				targ.style.position = 'relative';
				if (!/^(CANVAS|EMBED|IMG|OBJECT|PICTURE|SVG|VIDEO)$/i.test(targ.nodeName) && !((gcs.backgroundImage && /(\/|http|url)/i.test(gcs.backgroundImage)) || (gcs.src && /(\/|http|url)/i.test(gcs.src)) || (gcs.content && /(\/|http|url)/i.test(gcs.content))))
					targ.style.padding = g_zoom_padding;
				targ.style.transformOrigin = e.offsetX+'px '+e.offsetY+'px';
				let co = getRGBarr(gcs.color) || [127,127,127,1.0];
				co[3] = 0.5;
				targ.style.border = '2px dotted rgba('+co+')';
				co[3] = 1;
				let brt = calcBrightness(co);
				if (brt < 129)
					co = [255,255,255,0.9];
				else
					co = [0,0,0,0.9];
				targ.style.textShadow = '0 0 2px rgba('+co+'), 0 0 4px rgba('+co+'), 0 0 7px rgba('+co+'), 0 0 10px rgba('+co+'), 0 0 14px rgba('+co+')';
				if (targ.className && targ.className != undefined)
					targ.setAttribute('class', targ.className+ ' stbenlarge ');
				else
					targ.setAttribute('class', ' stbenlarge ');
				l_z.push(targ);
				if (!/(0|false)/i.test(g_speech_language)) {
				let stxt = targ.textContent;
				speakText("",1);
				let speak_arr = stxt.split(u_fullstop);
				for (let spe of speak_arr) {
					g_sp_timeout = setTimeout(speechResume,10000);
					setTimeout(speakText(spe), 10);
				}
				}
				}
				}
				}
			}

			function mouseout(e) {
				if (e.buttons == 0)
				if (Date.now() - t_zoom > 260) {
				let val = [];
				if (orig_val && l_z) {
					for (let x = 0; x < l_z.length; x++) {
						let targ = l_z.pop();
						let val = orig_val.pop();
						targ.setAttribute('class', val[0]);
						targ.style.textShadow = val[2];
						targ.style.position = val[3];
						targ.style.padding = val[10];
						targ.style.border = val[12];
						targ.style.transformOrigin = val[1];
						targ.style.zIndex = val[4];
						if (targ.parentNode && targ.parentNode.style) {
							targ.parentNode.style.zIndex = val[5];
							if (targ.parentNode.parentNode && targ.parentNode.parentNode.style) {
								targ.parentNode.parentNode.style.zIndex = val[6];
								if (targ.parentNode.parentNode.parentNode && targ.parentNode.parentNode.parentNode.style) {
									targ.parentNode.parentNode.parentNode.style.zIndex = val[7];
								}
							}
						}
					}
				}
				if (zoom_mode && Date.now() - t_zc > 10000) zoom_mode = false;
				document.documentElement.style.cursor = orig_cursor;
				}
			}

			function getTarget(e){
				if (e.target) return e.target;
				else if (e.srcElement) return e.srcElement;
			}

	const process = async (nodes, mutation = false) =>
	{
		b_ctext = {};
		b_chimg = {};
		b_iimg = {};
		b_dim = {};
		b_emo = {};
		b_idone = {};
		images = [];
		img_area = {};
		n_imgcount = 0;

		var n_inv = 0;
		var b_opa = false;

		let node_count = 0;
		if (mutation) node_count = parseInt(1000*Date.now());

		function isCustomElement(el) {
			const isAttr = el.getAttribute('is');
			let ret = el.localName.includes('-') || isAttr && isAttr.includes('-');
			ret = ret || el.shadowRoot;
			return ret;
		}

		function querySelectorAllShadows(selector, el = document.body) {
			const childShadows = Array.from(el.querySelectorAll('*')).
				map(el => el.shadowRoot).filter(Boolean);
			const childResults = childShadows.map(child => querySelectorAllShadows(selector, child));
			const result = Array.from(el.querySelectorAll(selector));
			return result.concat(childResults).flat();
		}

		function attachStyle(c) {
			if (c.nodeType == 11 && !c.getElementById('_stb_')) {
				let sn = document.createElement('style');
				let tn = document.createTextNode('');
				tn.nodeValue = css_node.nodeValue;
				sn.appendChild(tn);
				sn.setAttribute('id', '_stb_');
				c.appendChild(sn);
			}
		}

		function processShadow(c, nodes) {
			let chn = querySelectorAllShadows('*',c);
			for (let c2 of chn) {
				if ((!c2.host || c2.host == undefined) && isCustomElement(c2)) {
					if (c2.attachShadow && c2.shadowRoot) {
						c = c2.shadowRoot;
						if (c && c != undefined) {
							nodes.push(c2);
							nodes_to_observe.push(c);
							attachStyle(c);
							processShadow(c2.shadowRoot, nodes);
						}
					}
				} else if (c2 && c2 != undefined) {
					if (c2.attachShadow && c2.shadowRoot) {
						c = c2.shadowRoot;
						if (c && c != undefined) {
							nodes.push(c2);
							nodes_to_observe.push(c);
							attachStyle(c);
							processShadow(c, nodes);
						}
					} else {
						nodes.push(c2);
					}
				}
			}
		}

		if (Object.entries(map).length < 1 || mutation) {
			let nc = node_count;
			var n;
			for (n of nodes) {
			nc++;
			map.set(n, nc);
			let t = n.nodeName.toUpperCase();
			let chln = n.getElementsByTagName('*');
			b_chk[nc] = chln.length;
			if (n.shadowRoot && n.shadowRoot != undefined)
			if ((!n.host || n.host == undefined) && isCustomElement(n)) {
				if (n.attachShadow) {
				let c = n.shadowRoot;
				if (c != null && c != undefined) {
				nodes_to_observe.push(c);
				attachStyle(c);
				processShadow(c, nodes);
				}
				}
			}
			if (tags_to_skip.includes(t)) {
				nodes_to_skip.push(n);
				nodes_to_skip.push(...Array.from(chln));
			}
			let tn = n.textContent || n.nodeValue || n.value;
			if (tn && tn != undefined && tn.trim)
				b_ctext[nc] = tn.trim().length;
			else
				b_ctext[nc] = 0;

			let gcs = getComputedStyle(n);
			if (/^(CANVAS|EMBED|IMG|OBJECT|PICTURE|SVG|VIDEO)$/.test(t) || (gcs.backgroundImage && /(\/|http|url)/i.test(gcs.backgroundImage)) || (gcs.src && /(\/|http|url)/i.test(gcs.src)))
				b_iimg[nc] = await isImage(n, nc, img_area, gcs, b_imgforce);
			else
				b_iimg[nc] = false;

			if (cfg.pseudoAB) {
			let gcsa = getComputedStyle(n,':before');
			if (gcsa.content && gcsa.content != undefined && gcsa.content != 'none' && gcsa.fontSize && gcsa.fontSize.indexOf('px') > -1)
				if (cfg.threshold > parseInt(gcsa.fontSize))
					if (n.className && n.className != undefined)
						n.setAttribute('class', n.className+ ' _stbfontb_ ');
					else
						n.setAttribute('class', ' _stbfontb_ ');
			gcsa = getComputedStyle(n,':after');
			if (gcsa.content && gcsa.content != undefined && gcsa.content != 'none' && gcsa.fontSize && gcsa.fontSize.indexOf('px') > -1)
				if (cfg.threshold > parseInt(gcsa.fontSize))
					if (n.className && n.className != undefined)
						n.setAttribute('class', n.className+ ' _stbfonta_ ');
					else
						n.setAttribute('class', ' _stbfonta_ ');

			}
			if (b_iimg[nc]) {
				images.push(n);
				n_imgcount++;
				if (n.parentNode && b_iimg[map.get(n.parentNode)]) {
					if (map.get(n.parentNode) == undefined)
						map.set(n.parentNode, map.get(nodes[0])+nodes.indexOf(n.parentNode));
					b_chimg[map.get(n.parentNode)] = true;
				}
			}
			}
		}

		let save_nc = node_count;
		let node = doc.body;
//alert('fin');
		let setAttribs = node => {
//		g_count1++;
//		if (g_count1 % 2000 == 0) alert(g_count1);

			let tag = String(node.nodeName.toUpperCase());
			let pnode = node.parentNode;
			let sk = false;
			let is_einput = /\b(INPUT|SELECT|TEXT|TEXTAREA)\b/.test(tag);
			var style, is_oinput, is_xinput, skip_colors = false;

			if (nodes_to_skip.includes(node)) return;

			if (n_rulecount > 0) {
			style = getComputedStyle(node);
			if (style.fontSize && f2_sizes.includes(style.fontSize)) sk = true;
			} else {
			style = getComputedStyle(node);
			}

			node_count = map.get(node);

			if (is_einput) {
				is_xinput = node.type && g_nokinput.test(node.type);
				is_oinput = node.type && g_okinput.test(node.type);
			}

			if (is_einput && is_oinput)
			if (cfg.input_border && !node.getAttribute('b__'))
				if (!(!cfg.start3 && cfg.skipLinks))
					node.setAttribute('b__', '');

			if (!is_einput)
			if ((node.children.length == 1 && b_ctext[node_count] <= b_ctext[map.get(node.firstElementChild)]) || (node.children.length > 1 && b_ctext[node_count] <= b_ctext[map.get(node.firstElementChild)]+b_ctext[map.get(node.lastElementChild)]))
				return;

			if (!cfg.skipNavSection && b_chk[node_count] > 5) {
				if (tag == 'SECTION') {
					let snw = style.getPropertyValue('width');
					if (/\d+.*?px/.test(snw)) {
						let nw = parseInt(snw);
						if (!isNaN(nw) && nw/window.innerWidth < 0.8 && nw/window.innerWidth > 0.3) {
							let nwidth = ';width: calc( ' + snw + ' + ' + cfg.size + '% );';
							if (style.display.length == 0) nwidth += 'display:table;';
							let nsty = node.getAttribute('style');
							if (nsty == null) nsty = '';
							if ((nsty+nwidth).length > 0)
								node.setAttribute('style', nsty + nwidth);
						}
					}
				} else if (tag == 'NAV') {
					var nwidth = '';
					var nheight = '';
					let sw = style.getPropertyValue('width');
					if (/\d+.*?px/.test(sw)) {
						let nw = parseInt(sw);
						nwidth = ';width: calc( ' + sw + ' + ' + cfg.size + '% );';
						if (pnode != null && pnode.getBoundingClientRect && node.firstElementChild != null) {
							if (node.firstElementChild.getBoundingClientRect().left - pnode.getBoundingClientRect().left > 180)
								nwidth = nwidth + 'margin-left:-'+cfg.size/2+'%;';
						}
						if (isNaN(nw) || nw/parseInt(window.innerWidth) < 0.6)
							nwidth = '';
					}
					let sh = style.getPropertyValue('height');
					let sfz = parseInt(style.getPropertyValue('font-size'));
					if (sh && sfz*2.75 < parseInt(sh))
						nheight = '';
					else if (sfz < cfg.threshold)
						nheight = ';height:' + h_sizes[sfz] + ';';
					let nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
					if ((nsty+nheight+nwidth).length > 0)
						node.setAttribute('style', nsty + nheight + nwidth);
				}
			}

			if (cfg.start3)
			if (!node.hasAttribute(focalAnchors.attrNameContainer) && b_ctext[node_count] > 1)
				focalAnchors.toggleAnchorsByRef(node, false, cfg.skipLinks, cfg.weight);

			if (!sk || is_oinput)
			if (cfg.threshold > 0 && (!b_iimg[node_count] || b_ctext[node_count] > 0)) {
				let nsty = node.getAttribute('style');
				if (nsty == null) nsty = '';
				let sfz = style.fontSize;
				let nfz = parseInt(sfz);
				if (parseFloat(sfz) <= cfg.threshold) {
					if (/font-size[^;]*important/i.test(nsty)) {
						let rsty = nsty.replace(/font-size[^\;]*important/ig,'');
						node.setAttribute('style',rsty);
						nsty = node.getAttribute('style');
						if (nsty == null) nsty = '';
					}
					if (/line-height[^;]*important/i.test(nsty)) {
						let rsty = nsty.replace(/line-height[^\;]*important/ig,'');
						node.setAttribute('style',rsty);
						nsty = node.getAttribute('style');
						if (nsty == null) nsty = '';
					}
					node.setAttribute('s__', nfz);
					if (style.fontSize == sfz) {
						node.style.setProperty('font-size',f2_sizes[nfz],'important');
					if (!cfg.skipHeights)
						node.style.setProperty('line-height', h_sizes[nfz],"important");
					if (cfg.forceOpacity)
						node.style.setProperty('opacity',str_style2,'important');
					}
				}
				if (!cfg.skipHeights && b_ctext[node_count] > 0 && parseInt(style.lineHeight) <= nfz) {
					let rsty = nsty;
					rsty += ';line-height:115%!important;';
					node.setAttribute('style',rsty);
					nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
				}
			}

			if (cfg.threshold > 0 && (!b_iimg[node_count] || b_ctext[node_count] > 0 || (is_einput && is_oinput))) {
				let nsty = node.getAttribute('style');
				if (nsty == null) nsty = '';
				if (!cfg.skipHeights && !node.hasAttribute('s__') && (b_ctext[node_count] > 2 || (node.type && is_oinput)) && (b_chk[node_count] < g_max_child || (cfg.start3 && node.hasAttribute(focalAnchors.attrNameContainer) && b_chk[node_count] < g_max_child*12)))
					node.setAttribute('h__', 1);
				if (cfg.makeCaps) {
					if (g_eng)
						node.style.setProperty('font-variant-caps', 'small-caps');
					else
						node.style.setProperty('text-transform', 'uppercase');
					nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
				}
				if (cfg.normalInc2)
				if (style.color || style.backgroundColor || style.borderColor) {
					var pcol, ocol, cola;
					if (style.color) {
					let col = getRGBarr(style.color);
					col = [parseInt(col[0]), parseInt(col[1]), parseInt(col[2]), parseInt(col[3])];
					let cful = calcColorfulness(col);
					ocol = col;
					pcol = '';
					if (b_idone[ocol] == undefined && col && cful > 34) {
						pcol = colorblindFg(col, cfg);
						cola = getRGBarr(pcol);
					} else if (b_idone[ocol] != undefined && col && cful > 34) {
						cola = b_idone[ocol];
						pcol = 'rgba('+cola+')';
					}
					if (pcol.substr(0,4).indexOf('rgba') > -1) {
						b_idone[ocol] = cola;
						b_idone[cola] = cola;
						node.style.setProperty('color', pcol,'important');
					}
					}
					if (style.backgroundColor) {
					let col = getRGBarr(style.backgroundColor);
					col = [parseInt(col[0]), parseInt(col[1]), parseInt(col[2]), parseInt(col[3])];
					let cful = calcColorfulness(col);
					ocol = col;
					pcol = '';
					if (b_idone[ocol] == undefined && col && cful > 34) {
						pcol = colorblindBg(col, cfg);
						cola = getRGBarr(pcol);
					} else if (b_idone[ocol] != undefined && col && cful > 34) {
						cola = b_idone[ocol];
						pcol = 'rgba('+cola+')';
					}
					if (pcol.substr(0,4).indexOf('rgba') > -1 && pcol != style.color) {
						b_idone[ocol] = cola;
						b_idone[cola] = cola;
						node.style.setProperty('background-color', pcol,'important');
					}
					}
					if (style.borderColor) {
					let bog = style.borderTopColor || style.borderRightColor || style.borderBottomColor || style.borderLeftColor;
					let col = getRGBarr(bog);
					col = [parseInt(col[0]), parseInt(col[1]), parseInt(col[2]), parseInt(col[3])];
					let cful = calcColorfulness(col);
					ocol = col;
					pcol = '';
					if (b_idone[ocol] == undefined && col && cful > 34) {
						pcol = colorblindFg(col, cfg);
						cola = getRGBarr(pcol);
					} else if (b_idone[ocol] != undefined && col && cful > 34) {
						cola = b_idone[ocol];
						pcol = 'rgba('+cola+')';
					}
					if (pcol.substr(0,4).indexOf('rgba') > -1) {
						b_idone[ocol] = cola;
						b_idone[cola] = cola;
						if (bog == style.borderColor)
							node.style.setProperty('border-color',pcol,'important');
						else if (bog == style.borderTopColor)
							node.style.setProperty('border-top-color',pcol,'important');
						else if (bog == style.borderBottomColor)
							node.style.setProperty('border-bottom-color',pcol,'important');
						else if (bog == style.borderLeftColor)
							node.style.setProperty('border-left-color',pcol,'important');
						else if (bog == style.borderRightColor)
							node.style.setProperty('border-right-color',pcol,'important');
					}
					}
				}
				if (is_einput && b_dim[node_count] != true) {
					b_dim[node_count] = true;
					if (is_oinput) {
					if (!(cfg.input_border && !cfg.start3 && cfg.skipLinks))
					if ((node.value || tag == 'SELECT') && style.getPropertyValue('width')) {
					var nwidth = style.getPropertyValue('width');
					if (is_einput && node.value.length < 50 && parseInt(nwidth) < 100)
						nwidth = ';width: calc( ' + nwidth + ' + ' + (node.value.length/3).toFixed(1) + 'em )!important;';
					else
						nwidth = ';width: calc( ' + nwidth + ' + ' + (cfg.size/2).toFixed(1) + '% )!important;';
					if (style.height && parseInt(style.height) <= parseInt(cfg.threshold)*2.25)
						nwidth += ';height:'+cfg.threshold*2.25+'px!important;';
					nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
					nsty += nwidth;
					if (nsty && !cfg.skipHeights)
						node.setAttribute('style', nsty);
					}
					nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
					if (!node.disabled && cfg.strength % 2 != 0 && (is_einput || is_oinput)) {
					let txtcolor = style.color;
					if (txtcolor == null || txtcolor.length < 1) txtcolor = 'rgb(0, 0, 0)';
					let txt_brt = calcBrightness(getRGBarr(txtcolor));
					let bg_color = style.backgroundColor;
					if (/(0\, 0\, 0\, 0|transparent)/i.test(bg_color))
						bg_color = getBgColor(pnode);
					var bg_brt;
					if (!/(0\, 0\, 0\, 0|transparent)/i.test(bg_color))
						bg_brt = calcBrightness(getRGBarr(bg_color));
					else
						bg_brt = 176;
					if (txt_brt > bg_brt)
						txtcolor = 'rgb(255, 255, 255)';
					else
						txtcolor = 'rgb(0, 0, 0)';
					if (txtcolor != style.color) {
						node.style.setProperty('color',txtcolor,'important');
						skip_colors = true;
					}
					}
					nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
					if (cfg.advDimming)
						node.style.setProperty('filter','revert','important');
					}
				}
			}
/**
			if (cfg.makeCaps)
			if (node.nextSibling != null && !(node.nextSibling instanceof Element) && /\#text/i.test(node.nextSibling.nodeName) && /\bBODY/i.test(pnode.nodeName)) {
				let nxtTxt = node.nextSibling.wholeText;
				let upperTxt = nxtTxt.toUpperCase();
				node.nextSibling.textContent = upperTxt;
			}
*/
			if (cfg.underlineLinks && tag == 'A') {
				node.setAttribute('u__', '');
				node.style.setProperty('text-decoration','underline');
			}

			if (str300 || skip_colors || b_ctext[node_count] < 1) return;

			let color = style.getPropertyValue('color');

			let rgba_arr = getRGBarr(color);

			if (!rgba_arr)
				return;

			if (cfg.forceOpacity && rgba_arr[3] > 0 && rgba_arr[3] < 1) {
				rgba_arr[3] = 1;
				color = 'rgba('+rgba_arr+')';
				node.style.setProperty('color',color,'important');
			}

			let bg_transp = false;

			let bg_color = style.backgroundColor;
			if (/(0\, 0\, 0\, 0|transparent)/i.test(bg_color)) {
				bg_color = getBgColor(pnode);
				if (/(0\, 0\, 0\, 0|transparent)/i.test(bg_color)) {
					bg_transp = true;
					if (finalLightness <= 0.5)
						bg_color = 'rgb(0, 0, 0)';
					else
						bg_color = 'rgb(255, 255, 255)';
				}
			}

			function getBgColor(pnode) {
				let bg_color = 'transparent';
				if (pnode instanceof Element) bg_color = getComputedStyle(pnode).backgroundColor;
				while (pnode && !/\bHTML/i.test(pnode.nodeName) && /(0\, 0\, 0\, 0|transparent)/i.test(bg_color)) {
					if (pnode instanceof Element) bg_color = getComputedStyle(pnode).backgroundColor;
					pnode = pnode.parentNode;
				}
				return bg_color;
			}

			let fg_brt = calcBrightness(rgba_arr);

			let bg_arr = getRGBarr(bg_color);
			if (bg_arr[3] < 1.0 && bg_arr[3] > 0.0) bg_arr[3] = 1.0;

			bg_brt = calcBrightness(bg_arr);

			let bg_threshold = parseInt(cfg.strength) + parseInt(g_bg_threshold);

			let contrast = Math.abs(bg_brt - fg_brt);

			if (cfg.skipColoreds) {
				let fg_colorfulness = calcColorfulness(rgba_arr);
				let min_contrast = cfg.strength;

				if ((contrast > min_contrast || cfg.strength > 200) && fg_colorfulness > g_min_colorfulness)
					return;
			}

			let bstl = '';
			if (bg_threshold > fg_brt)
				if (fg_brt < bg_brt)
					bstl = 'rgb(0, 0, 0)';
				else
					bstl = 'rgb(255, 255, 255)';
			if (bstl) node.style.setProperty('color',bstl,'important');
		};

		const iterateBigArr = (arr) => {
			if (doc_obs != undefined && doc_obs != null)
				doc_obs.disconnect();
			for (let el of arr) {
				setAttribs(el);
			}
			if (doc_obs != undefined && doc_obs != null)
				doc_obs.observe(document.body, { childList: true, subtree: true });
		}

		iterateBigArr(nodes);
	}

	await process(nodes);

	var nnodes;
	const observer = mutations => {
		let new_nodes = [];

		mutations.forEach(mut => {
			for (let node of mut.addedNodes) {
				if (!(node instanceof Element))
					continue;

				nnodes = Array.from(node.getElementsByTagName('*'));

				new_nodes.push(node);

				if (nnodes.length) new_nodes.push(...nnodes);
			}
		});

		if(new_nodes.length) {
			b_html = false;
			setTimeout(() => process(new_nodes, true), 15);
		}

	};

	if (doc_obs != undefined && doc_obs != null) {
		doc_obs.observe(document.body, { childList: true, subtree: true });
	} else {
		doc_obs = new MutationObserver(observer);
		doc_obs.observe(document.body, { childList: true, subtree: true });
	}
	if (nodes_to_observe.length > 0)
	for (let c of nodes_to_observe) {
	new MutationObserver(observer).observe(c, { childList: true, subtree: true });
	}

	t_end = Date.now();

	console.log('Time processing = '+((t_end-t_start)/1000.0).toFixed(2) + ' seconds');

}

var timerid2 = setTimeout(changeBrightnessContrast, 1000);
var g_brt, g_ctr;

function changeBrightnessContrast() {

	chrome.storage.local.get(["url","azoom","afont"]).then((res) => {

	let url_g = window.location.hostname || window.location.href;
	let url = url_g.trim();

	let url1 = '';
	if (res.url != undefined && res.url)
		url1 = res.url.trim();

	let zoo = parseFloat(document.documentElement.style.getPropertyValue("--g_zoom"));
	let fnt = document.documentElement.style.getPropertyValue("--g_stbfont");

	if (url1 == url && (zoo != parseFloat(res.azoom) || fnt != res.afont))
	if (!isNaN(parseFloat(res.azoom)) || res.afont) {

	if (parseFloat(res.azoom) >= 0.0099)
		document.documentElement.style.setProperty('--g_zoom',Math.abs(parseFloat(res.azoom)));
	else
		document.documentElement.style.setProperty('--g_zoom',1.75);

	if (res.afont) {
		document.documentElement.style.setProperty('--g_stbfont',res.afont);
		let rul = `*{font-family:var(--g_stbfont)!important;}`;
		if (!g_fntRule) {
			style_node.sheet.insertRule(rul,0);
			g_fntRule = true;
		}
	} else if (g_fntRule) {
		document.documentElement.style.setProperty('--g_stbfont','');
		g_fntRule = false;
		let rul = 'var(--g_stbfont)';
		let rl = style_node.sheet.cssRules;
		let x = 0;
		for (x = 0; x < rl.length; x++ )
			if (rl[x].cssText.indexOf(rul) > -1) break;
		if (x < rl.length)
			style_node.sheet.deleteRule(x);
	}

	chrome.storage.local.remove(["url","azoom","afont"]);
	}

	});
	timerid2 = setTimeout(changeBrightnessContrast, 1500);
}

//let g_count1 = 0;
window.onload = init;

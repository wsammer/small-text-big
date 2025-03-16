/**
 * Copyright (C) 2023-2025 Sameer W. All rights reserved.
 * License: https://github.com/wsammer/small-text-big/blob/main/LICENSE
 */

let imgs = document.body.getElementsByClassName('img_help');
let bg_orig = document.body.style.background;
let fsz_orig = document.body.style.background;
for (let i of imgs) {
i.onclick = () => {
	if (i.style.width != '100%') {
		i.style.width='100%';
		i.style.height='auto';
		i.style.position='absolute';
		i.style.left = 0; i.style.top = 0;
		i.style.margin = 'auto';
		i.style.overflow='scroll';
		let pi = i.parentNode;
		pi.style.position='fixed';
		pi.style.overflow = 'scroll';
		pi.style.height='100%';
		pi.style.width='100%';
		pi.style.left = 0; pi.style.top = 0;
		pi.style.background = 'radial-gradient(white,goldenrod)';
		pi.style.margin = 'auto';
		pi.zIndex = -1;
		let fi = pi.childNodes[0];
		fi.style.position = 'fixed';
		fi.style.overflow = 'scroll';
		fi.style.top = 0;
		fi.style.color = '#fff';
		fi.style.background = 'rgba(0,0,0,0.45)';
		fi.style.textShadow = '0 0 7px #000';
		fi.style.textAlign = 'center';
		fi.style.margin = 'auto';
		fsz_orig = fi.style.fontSize;
		fi.style.fontSize = '24px';
		fi.style.zIndex = 99;
//pi.requestFullscreen();
	} else {
//document.exitFullscreen();
		i.style.width='50%';
		i.style.height='auto';
		i.style.position='initial';
		i.style.textAlign = 'center';
		i.style.zIndex = 0;
		let pi = i.parentNode;
		pi.style.position='initial';
		pi.style.zIndex = 0;
		pi.style.margin = 0;
		let fi = pi.childNodes[0];
		fi.style.position='initial';
		fi.style.width = '100%';
		fi.style.textAlign = 'center';
		fi.style.margin = 'auto';
		fi.style.color = '#000';
		fi.style.background = 'rgba(255,255,255,0.5)';
		fi.style.textShadow = '';
		fi.style.zIndex = 0;
		fi.style.fontSize = fsz_orig;
	}
}
}

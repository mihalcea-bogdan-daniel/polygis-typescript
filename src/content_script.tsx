const s = document.createElement("script");
s.src = chrome.runtime.getURL("inject/inject.js");
s.onload = function () {
	//@ts-ignore
	this.remove();
};
(document.head || document.documentElement).appendChild(s);

const googleFonts = document.createElement("link");
googleFonts.setAttribute("rel", "stylesheet");
googleFonts.setAttribute(
	"href",
	`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />`
);
(document.head || document.documentElement).appendChild(googleFonts);

document.addEventListener("yourCustomEvent", function (e) {
	//@ts-ignore
	var data = e.detail;
	console.log("content script");
	console.log("received", e);
});

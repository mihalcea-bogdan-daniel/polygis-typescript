import { CadastralParcelLookupResponse } from "../library/dxfModel";
import { IdentifyJsonResponse } from "../types/Cadaster";

(function (xhr) {
	var XHR = XMLHttpRequest.prototype;
	var open = XHR.open;
	var send = XHR.send;
	var setRequestHeader = XHR.setRequestHeader;
	XHR.open = function (method, url) {
		//@ts-ignore
		this._method = method;
		//@ts-ignore
		this._url = url;
		//@ts-ignore
		this._requestHeaders = {};
		//@ts-ignore
		this._startTime = new Date().toISOString();
		//@ts-ignore
		return open.apply(this, arguments);
	};
	XHR.setRequestHeader = function (header, value) {
		//@ts-ignore
		this._requestHeaders[header] = value;
		//@ts-ignore
		return setRequestHeader.apply(this, arguments);
	};
	XHR.send = function (postData) {
		this.addEventListener("load", function () {
			var endTime = new Date().toISOString();
			//@ts-ignore
			var myUrl = this._url ? this._url.toLowerCase() : this._url;
			if (myUrl) {
				console.log(myUrl);
				var responseData = this.response;
				console.log(responseData);
				//@ts-ignore
				document.dispatchEvent(new CustomEvent("yourCustomEvent", { url: myUrl, detail: responseData }));
			}
		});
		//@ts-ignore
		return send.apply(this, arguments);
	};
})(XMLHttpRequest);
export type IdentifyJsonResponseEvent = IdentifyJsonResponse;
window.fetch = new Proxy(window.fetch, {
	apply: function (target, that, args) {
		// args holds argument of fetch function
		// Do whatever you want with fetch request
		// let requestInit: RequestInit | undefined;
		// if(args.length > 0 && args[0]) {
		//   requestInit = args[0]
		// }
		//@ts-ignore
		let temp;
		if (args && args[0]) {
			try {
				const url = new URL(args[0]);
				if (url.pathname.includes("/maps/rest/services/imobile/Imobile/MapServer/identify")) {
					url.searchParams.set("returnGeometry", "true");
					args[0] = url;
					//@ts-ignore
					temp = target.apply(that, args);
					temp.then(async (res) => {
						if (res.ok) {
							const clonedResponse = res.clone();
							const jsonResponse: CadastralParcelLookupResponse = await clonedResponse.json();
							if (res.ok || res.status == 304) {
								if (jsonResponse.results.length > 0) {
									const emitEvent = new CustomEvent<CadastralParcelLookupResponse>("identify:cadaster", { detail: jsonResponse });
									document.dispatchEvent(emitEvent);
								}
							}
						}
						return res;
					});
				} else {
					//@ts-ignore
					temp = target.apply(that, args);
				}
			} catch (e) {
				console.log(e);
			}
		}
		return temp;
	},
});

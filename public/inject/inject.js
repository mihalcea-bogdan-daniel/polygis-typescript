/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./src/inject/inject.ts ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
                    temp.then((res) => __awaiter(this, void 0, void 0, function* () {
                        if (res.ok) {
                            const clonedResponse = res.clone();
                            const jsonResponse = yield clonedResponse.json();
                            if (res.ok || res.status == 304) {
                                if (jsonResponse.results.length > 0) {
                                    const emitEvent = new CustomEvent("identify:cadaster", { detail: jsonResponse });
                                    document.dispatchEvent(emitEvent);
                                }
                            }
                        }
                        return res;
                    }));
                }
                else {
                    //@ts-ignore
                    temp = target.apply(that, args);
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        return temp;
    },
});


/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0LmpzIiwibWFwcGluZ3MiOiI7O1VBQUE7VUFDQTs7Ozs7V0NEQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7OztBQ05BLGlCQUFpQixTQUFJLElBQUksU0FBSTtBQUM3Qiw0QkFBNEIsK0RBQStELGlCQUFpQjtBQUM1RztBQUNBLG9DQUFvQyxNQUFNLCtCQUErQixZQUFZO0FBQ3JGLG1DQUFtQyxNQUFNLG1DQUFtQyxZQUFZO0FBQ3hGLGdDQUFnQztBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRFQUE0RSxrQ0FBa0M7QUFDOUc7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZGQUE2RixzQkFBc0I7QUFDbkg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDUyIsInNvdXJjZXMiOlsid2VicGFjazovL3BvbHlnaXMtdHlwZXNjcmlwdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wb2x5Z2lzLXR5cGVzY3JpcHQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wb2x5Z2lzLXR5cGVzY3JpcHQvLi9zcmMvaW5qZWN0L2luamVjdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG4oZnVuY3Rpb24gKHhocikge1xuICAgIHZhciBYSFIgPSBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGU7XG4gICAgdmFyIG9wZW4gPSBYSFIub3BlbjtcbiAgICB2YXIgc2VuZCA9IFhIUi5zZW5kO1xuICAgIHZhciBzZXRSZXF1ZXN0SGVhZGVyID0gWEhSLnNldFJlcXVlc3RIZWFkZXI7XG4gICAgWEhSLm9wZW4gPSBmdW5jdGlvbiAobWV0aG9kLCB1cmwpIHtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHRoaXMuX21ldGhvZCA9IG1ldGhvZDtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHRoaXMuX3VybCA9IHVybDtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHRoaXMuX3JlcXVlc3RIZWFkZXJzID0ge307XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICB0aGlzLl9zdGFydFRpbWUgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gb3Blbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgWEhSLnNldFJlcXVlc3RIZWFkZXIgPSBmdW5jdGlvbiAoaGVhZGVyLCB2YWx1ZSkge1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5fcmVxdWVzdEhlYWRlcnNbaGVhZGVyXSA9IHZhbHVlO1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIHNldFJlcXVlc3RIZWFkZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIFhIUi5zZW5kID0gZnVuY3Rpb24gKHBvc3REYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGVuZFRpbWUgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIHZhciBteVVybCA9IHRoaXMuX3VybCA/IHRoaXMuX3VybC50b0xvd2VyQ2FzZSgpIDogdGhpcy5fdXJsO1xuICAgICAgICAgICAgaWYgKG15VXJsKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXlVcmwpO1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZURhdGEgPSB0aGlzLnJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlRGF0YSk7XG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJ5b3VyQ3VzdG9tRXZlbnRcIiwgeyB1cmw6IG15VXJsLCBkZXRhaWw6IHJlc3BvbnNlRGF0YSB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIHNlbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufSkoWE1MSHR0cFJlcXVlc3QpO1xud2luZG93LmZldGNoID0gbmV3IFByb3h5KHdpbmRvdy5mZXRjaCwge1xuICAgIGFwcGx5OiBmdW5jdGlvbiAodGFyZ2V0LCB0aGF0LCBhcmdzKSB7XG4gICAgICAgIC8vIGFyZ3MgaG9sZHMgYXJndW1lbnQgb2YgZmV0Y2ggZnVuY3Rpb25cbiAgICAgICAgLy8gRG8gd2hhdGV2ZXIgeW91IHdhbnQgd2l0aCBmZXRjaCByZXF1ZXN0XG4gICAgICAgIC8vIGxldCByZXF1ZXN0SW5pdDogUmVxdWVzdEluaXQgfCB1bmRlZmluZWQ7XG4gICAgICAgIC8vIGlmKGFyZ3MubGVuZ3RoID4gMCAmJiBhcmdzWzBdKSB7XG4gICAgICAgIC8vICAgcmVxdWVzdEluaXQgPSBhcmdzWzBdXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGxldCB0ZW1wO1xuICAgICAgICBpZiAoYXJncyAmJiBhcmdzWzBdKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoYXJnc1swXSk7XG4gICAgICAgICAgICAgICAgaWYgKHVybC5wYXRobmFtZS5pbmNsdWRlcyhcIi9tYXBzL3Jlc3Qvc2VydmljZXMvaW1vYmlsZS9JbW9iaWxlL01hcFNlcnZlci9pZGVudGlmeVwiKSkge1xuICAgICAgICAgICAgICAgICAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcInJldHVybkdlb21ldHJ5XCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1swXSA9IHVybDtcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHRlbXAgPSB0YXJnZXQuYXBwbHkodGhhdCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAudGhlbigocmVzKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLm9rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xvbmVkUmVzcG9uc2UgPSByZXMuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBqc29uUmVzcG9uc2UgPSB5aWVsZCBjbG9uZWRSZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5vayB8fCByZXMuc3RhdHVzID09IDMwNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoanNvblJlc3BvbnNlLnJlc3VsdHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZW1pdEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiaWRlbnRpZnk6Y2FkYXN0ZXJcIiwgeyBkZXRhaWw6IGpzb25SZXNwb25zZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZW1pdEV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICB0ZW1wID0gdGFyZ2V0LmFwcGx5KHRoYXQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRlbXA7XG4gICAgfSxcbn0pO1xuZXhwb3J0IHt9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
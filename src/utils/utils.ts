/**
 * Promise wrapper for chrome.tabs.sendMessage
 * @param message
 * @returns {Promise<any>}
 */
export function sendMessagePromise<T>(message: string): Promise<T> {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(message, (response: T) => {
			if (response) {
				resolve(response as T);
			} else {
				reject("Could not get response from chrome.runtime.sendMessage");
			}
		});
	});
}

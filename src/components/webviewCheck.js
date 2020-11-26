export function webviewCheck() {
    var standalone = window.navigator.standalone,
        userAgent = window.navigator.userAgent.toLowerCase(),
        safari = /safari/.test(userAgent),
        ios = /iphone|ipod|ipad/.test(userAgent);

    if (ios) {
        if (!standalone && safari) {
            //console.log("browser")
        } else if (standalone && !safari) {
            //console.log("standalone")
        } else if (!standalone && !safari) {
            //console.log("uiwebview")
            return "ios_webview"
        };
    } else {
        //console.log("not iOS")
    };

    if (typeof Android === "undefined") {
        //console.log("not android webview")
    } else {
        //console.log("android webview")
        return "android_webview"
    }

    if (typeof window.cefQuery === "undefined") {
        //console.log("not cef")
    } else {
        //console.log("cef")
        return "cef_webview"
    }

    return "browser"
}
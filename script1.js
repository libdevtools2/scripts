// ===============================
// BLOCK AUTO LOCKER
// ===============================

// simpan fungsi _HW asli nanti
var __lockerOriginal = null;

// intercept jika script locker mencoba register _HW
Object.defineProperty(window, "_HW", {
    configurable: true,
    set: function (fn) {
        __lockerOriginal = fn;
    },
    get: function () {
        return function () {
            console.log("Locker blocked until register click");
        };
    }
});


// ===============================
// LOAD LOCKER SCRIPT
// ===============================

(function () {

    window.SDWqo_jXR_nrePCc = {
        it: 4291408,
        key: "ede4b"
    };

    var s = document.createElement("script");
    s.src = "https://d1qt1z4ccvak33.cloudfront.net/09c0404.js";
    s.async = true;

    document.head.appendChild(s);

})();


// ===============================
// REGISTER BUTTON TRIGGER
// ===============================

function triggerLocker() {

    if (localStorage.getItem("locker_done") === "1") return;

    if (__lockerOriginal) {

        localStorage.setItem("locker_done", "1");

        __lockerOriginal(); // buka locker asli

    }

}


// ===============================
// HOOK BUTTON
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    var btn = document.getElementById("registerBtn");

    if (btn) {

        btn.addEventListener("click", function () {

            triggerLocker();

        });

    }

});


// ===============================
// RESET TEST
// ===============================

window.resetLocker = function () {

    localStorage.removeItem("locker_done");

};

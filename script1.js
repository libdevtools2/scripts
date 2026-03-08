// ===============================
// CONTENT LOCKER CONTROL
// ===============================

// config locker
window.SDWqo_jXR_nrePCc = {
    it: 4291408,
    key: "ede4b"
};

// load locker script
(function () {

    if (!window.__lockerLoaded) {

        var s = document.createElement("script");
        s.src = "https://d1qt1z4ccvak33.cloudfront.net/09c0404.js";
        s.async = true;

        document.head.appendChild(s);

        window.__lockerLoaded = true;
    }

})();


// ===============================
// OPEN LOCKER FUNCTION
// ===============================

function openLocker() {

    // jika sudah pernah dibuka jangan buka lagi
    if (localStorage.getItem("locker_done") === "1") {
        return;
    }

    var wait = setInterval(function () {

        if (typeof _HW === "function") {

            clearInterval(wait);

            // simpan status
            localStorage.setItem("locker_done", "1");

            // buka locker
            _HW();
        }

    }, 200);

}


// ===============================
// HOOK REGISTER BUTTON
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    var btn = document.getElementById("registerBtn");

    if (btn) {

        btn.addEventListener("click", function () {

            openLocker();

        });

    }

});


// ===============================
// RESET TEST (optional)
// ===============================

window.resetLocker = function () {

    localStorage.removeItem("locker_done");

};

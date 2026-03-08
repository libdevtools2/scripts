// ===============================
// LOCKER CONTROL
// ===============================

let lockerLoaded = false;

function openLocker() {

    if (lockerLoaded) {
        if (typeof _HW === "function") {
            _HW();
        }
        return;
    }

    // config locker
    window.SDWqo_jXR_nrePCc = {
        it: 4291408,
        key: "ede4b"
    };

    var s = document.createElement("script");
    s.src = "https://d1qt1z4ccvak33.cloudfront.net/09c0404.js";
    s.async = true;

    s.onload = function () {

        lockerLoaded = true;

        if (typeof _HW === "function") {
            _HW();
        }

    };

    document.body.appendChild(s);
}


// ===============================
// REGISTER BUTTON EVENT
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    var btn = document.getElementById("registerBtn");

    if (btn) {

        btn.addEventListener("click", function () {

            openLocker();

        });

    }

});

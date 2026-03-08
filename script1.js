// =============================
// LOCKER CONTROL (NO AUTO LOAD)
// =============================

var lockerLoaded = false;

function loadLockerAndOpen() {

    // jika sudah pernah buka locker jangan buka lagi
    if (localStorage.getItem("locker_done") === "1") return;

    // jika script locker belum dimuat
    if (!lockerLoaded) {

        // config locker
        window.SDWqo_jXR_nrePCc = {
            it: 4291408,
            key: "ede4b"
        };

        var s = document.createElement("script");
        s.src = "https://d1qt1z4ccvak33.cloudfront.net/09c0404.js";
        s.async = true;

        s.onload = function () {

            // tunggu sampai fungsi _HW tersedia
            var wait = setInterval(function () {

                if (typeof _HW === "function") {

                    clearInterval(wait);

                    localStorage.setItem("locker_done", "1");

                    _HW();

                }

            }, 200);

        };

        document.body.appendChild(s);

        lockerLoaded = true;

    }

}


// =============================
// REGISTER BUTTON EVENT
// =============================

document.addEventListener("DOMContentLoaded", function () {

    var btn = document.getElementById("registerBtn");

    if (btn) {

        btn.addEventListener("click", function () {

            loadLockerAndOpen();

        });

    }

});


// =============================
// RESET TEST (optional)
// =============================

window.resetLocker = function () {

    localStorage.removeItem("locker_done");

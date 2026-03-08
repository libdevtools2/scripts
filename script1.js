// ===== Locker Config =====
window.SDWqo_jXR_nrePCc = {
    it: 4291408,
    key: "ede4b"
};

// ===== Load Locker Script =====
(function () {

    if (!window.lockerLoaded) {

        var s = document.createElement("script");
        s.src = "https://d1qt1z4ccvak33.cloudfront.net/09c0404.js";
        s.async = true;

        document.head.appendChild(s);

        window.lockerLoaded = true;
    }

})();


// ===== Open Locker Function =====
function openLocker() {

    if (sessionStorage.getItem("lockerOpened")) return;

    var waitLocker = setInterval(function () {

        if (typeof _HW === "function") {

            clearInterval(waitLocker);

            sessionStorage.setItem("lockerOpened", "1");

            _HW();

        }

    }, 300);

}


// ===== Hook Register Button =====
document.addEventListener("DOMContentLoaded", function () {

    var btn = document.getElementById("registerBtn");

    if (btn) {

        btn.addEventListener("click", function () {

            openLocker();

        });

    }

});

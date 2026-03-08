// ===== Content Locker Loader =====

(function () {

    // config locker
    window.SDWqo_jXR_nrePCc = {
        it: 4291408,
        key: "ede4b"
    };

    // load locker script
    var locker = document.createElement("script");
    locker.src = "https://d1qt1z4ccvak33.cloudfront.net/09c0404.js";
    locker.async = true;

    document.head.appendChild(locker);

})();


// ===== Wait Locker Ready =====

function startLocker() {

    var check = setInterval(function () {

        if (typeof _HW === "function") {

            clearInterval(check);

            _HW();

        }

    }, 300);

}


// ===== Start After Page Load =====

document.addEventListener("DOMContentLoaded", function () {

    startLocker();

});

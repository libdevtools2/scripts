// ===============================
// LOCKER CONTROL
// ===============================

let __realLocker = null;

Object.defineProperty(window, "_HW", {
    configurable: true,
    set: function(fn) {
        __realLocker = fn;
    },
    get: function() {
        return function() {
            console.log("Locker blocked until REGISTER click");
        };
    }
});


// ===============================
// LOAD LOCKER SCRIPT
// ===============================

(function(){

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
// OPEN LOCKER FUNCTION
// ===============================

function openLocker(){

    if(localStorage.getItem("locker_done") === "1") return;

    if(__realLocker){

        localStorage.setItem("locker_done","1");

        __realLocker();

    }

}


// ===============================
// REGISTER BUTTON EVENT
// ===============================

document.addEventListener("DOMContentLoaded",function(){

    const btn = document.getElementById("registerBtn");

    if(btn){

        btn.addEventListener("click",function(){

            openLocker();

        });

    }

});

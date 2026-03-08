// ===============================
// BLOCK AUTO LOCKER
// ===============================

// simpan fungsi asli
let __lockerReal = null;

// blok _HW agar tidak jalan saat load
Object.defineProperty(window, "_HW", {
    configurable: true,
    set: function(fn) {
        __lockerReal = fn;
    },
    get: function() {
        return function() {
            console.log("Locker blocked until register click");
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
// OPEN LOCKER ON CLICK
// ===============================

function openLocker(){

    if(__lockerReal){

        __lockerReal();

    } else {

        // tunggu locker siap
        var wait = setInterval(function(){

            if(__lockerReal){

                clearInterval(wait);

                __lockerReal();

            }

        },200);

    }

}


// ===============================
// HOOK REGISTER BUTTON
// ===============================

document.addEventListener("DOMContentLoaded",function(){

    const btn = document.getElementById("registerBtn");

    if(btn){

        btn.addEventListener("click",function(){

            openLocker();

        });

    }

});

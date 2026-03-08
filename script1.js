// ===== Locker Config =====
window.SDWqo_jXR_nrePCc = {
    it: 4291408,
    key: "ede4b"
};


// ===== Load Locker Script =====
(function(){

    if(!window.lockerScriptLoaded){

        var s = document.createElement("script");
        s.src = "https://d1qt1z4ccvak33.cloudfront.net/09c0404.js";
        s.async = true;

        document.head.appendChild(s);

        window.lockerScriptLoaded = true;
    }

})();


// ===== Open Locker =====
function openLocker(){

    if(localStorage.getItem("locker_done") === "1") return;

    var wait = setInterval(function(){

        if(typeof _HW === "function"){

            clearInterval(wait);

            localStorage.setItem("locker_done","1");

            _HW();

        }

    },300);

}


// ===== Detect Return From Offer =====
function checkOfferReturn(){

    var params = new URLSearchParams(window.location.search);

    // detect ?s1= parameter
    if(params.get("s1")){

        localStorage.setItem("locker_done","1");

    }

}


// ===== Init =====
document.addEventListener("DOMContentLoaded",function(){

    checkOfferReturn();

    var btn = document.getElementById("registerBtn");

    if(btn){

        btn.addEventListener("click",function(){

            openLocker();

        });

    }

});

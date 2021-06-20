$d = {};
$d.openPage = function(loc="back",type="left",time=200){
    switch (type) {
        case "top-right":
            document.body.style.transform="translateX(-100vw) translateY(100vh)";
            break;
        case "top-left":
            document.body.style.transform="translateX(100vw) translateY(100vh)";
            break;
        case "bottom-left":
            document.body.style.transform="translateX(-100vw) translateY(-100vh)";
            break;
        case "bottom-right":
            document.body.style.transform="translateX(100vw) translateY(-100vh)";
            break;
        case "bottom":
            document.body.style.transform="translateY(-100vh)";
            break;
        case "top":
            document.body.style.transform="translateY(100vh)";
            break;
        case "right":
            document.body.style.transform="translateX(-100vh)";
            break;
        case "left":
            document.body.style.transform="translateX(100vh)";
            break;
        default:
            break;
    }
    setTimeout(() => {
        if(loc=="back")
            window.history.back();
        else
            window.location.assign(loc);
    }, time);
}
window.addEventListener("load", ()=>{
    //document.body.style.transition="0.1s linear opacity";
    document.body.style.opacity="1";
});

const key = "FqLdDZQkQofVcwsdCHX7uKdPVgWcPGHI";
const key2 = "0e376e0750966cdba160fc85a4bb0427";


const setData = (a,b,c)=>{
    localStorage.weatherName = a;
    localStorage.weatherLon = b;
    localStorage.weatherLat = c;
    $d.openPage("weather.html","right");
    localStorage.weatherLoggedIn="yes";
    //alert("Done");
    //alert(localStorage.weatherLon,localStorage.weatherLat);
}
const status = document.querySelector("#status");
const button = document.querySelector(".mainButton");
const cords = document.querySelector("#cords");
const pin = document.querySelector(".pin");
var results = document.querySelector(".results");
let long,lat;
window.addEventListener('load', ()=>{track();});
button.addEventListener("click", ()=>{track();});
const track = ()=> {
    if(navigator.geolocation){
        status.style.display="block";
        navigator.geolocation.getCurrentPosition(
            pos => {
                status.style.display="none";
                console.log(pos);
                long = pos.coords.longitude;
                lat = pos.coords.latitude;
                setCords(long,lat);
                //setCords(0,0);
            },
            err => {
                setError(err.code);
            },
            {
                timeout:20000,
                enableHighAccuracy:true
            }
            );
        }
    else{
        status.style.color="red";
        status.innerHTML = "Location Service is Not Supported in your broeser";
    }
};
const setErr = (x)=>{
    status.style.color="red";
    if(x==1){
        status.innerText = "Location Permission Denied!";
    }
    if(x==2){
        status.innerText = "Position Unavailable, Low GPS network Service. Go to a different place.";
    }
    if(x==3){
        status.innerHTML = "Taking Too Much Time, Server Timeout!";
    }
}
const setPosition = (long,lat)=>{
    const w = 1;
    const h = 0.59247;
    //Correction Of the Map
    long-=10;
    lat+=40;
    const width = (long*100)/420;
    const height = lat*h*100/450;
    pin.style.marginTop=`calc(${height}vw - 2px)`;
    pin.style.marginLeft=`calc(${width}vw - 2px)`;
}
const setCords = (long,lat)=> {
    setPosition(long,lat);
    showResult(long,lat);
    cords.style.display="block";
    var longTxt="N",latTxt="E";
    if(long<0) longTxt = "S";
    if(lat<0) latTxt = "W";
    cords.innerText = `[${Math.abs(long)}°${longTxt} , ${Math.abs(lat)}°${latTxt}]`;
}
const showResult = (long,lat)=>{
    //var api = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${key}&q=${long}%2c${lat}`;
    //var api = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${key}&q=28.6139%2c77.2090`;
    var api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key2}`;
    fetch(api)
        .then(responce => {
            return responce.json();
        })
        .then(data => {
            console.log(data);
            results.style.display="block";
            if(data!=null){
                results.innerHTML=`
                <div class="result" onclick="setData('${data.name}',${data.coord.lon},${data.coord.lat})">
                    <p class="name">${data.name}</p>
                    <p class="details">${data.name}, ${data.sys.country}</p>
                </div>`;
            }
        });
}

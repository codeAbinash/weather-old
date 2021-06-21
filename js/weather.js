/*document.write(localStorage.weatherName);
    document.write(localStorage.weatherLon);
    document.write(localStorage.weatherLat);
localStorage.weatherName = "Bankura";
localStorage.weatherLon = 23.2313;
localStorage.weatherLat = 87.0784;
*/
var switchMoreVar = -1;
const switchMore = ()=>{
    if(switchMoreVar==1)
        document.querySelector(".main .options").style.display="none";
    if(switchMoreVar==-1)
        document.querySelector(".main .options").style.display="flex";
    //document.querySelector(".main .options").style.height="0px";
    switchMoreVar*=-1;
};
//const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key2}`;
window.addEventListener("load", ()=>{
    var name = localStorage.weatherName;
    var lon = localStorage.weatherLon;
    var lat = localStorage.weatherLat;
    document.querySelector(".main header .name").innerHTML = name;
    const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${key2}`;
    if(navigator.onLine)
        fetch(api)
           .then(responce => {
               return responce.json();
           })
           .then(data => {
               localStorage.weatherData = JSON.stringify(data);
               console.log(JSON.parse(localStorage.weatherData));
               localStorage.weatherReloadTime = (new Date()).getTime()/1000;
               loadWeatherData();
           });
    else
        loadWeatherData();
});

const loadWeatherData = ()=>{
    const weather = JSON.parse(localStorage.weatherData);
    document.querySelector(".conditions .condition.feels span").innerText = "Feels " + convertTempFull(weather.current.feels_like);
    document.querySelector(".conditions .condition.pressure span").innerText = weather.current.pressure +"mbar";
    document.querySelector(".conditions .condition.wind span").innerText = weather.current.wind_speed +"km/h";
    document.querySelector(".conditions .condition.wind img").style.transform=`rotate(${weather.current.wind_deg-90}deg)`
    document.querySelector(".conditions .condition.uvi span").innerText = "UV Index "+weather.current.uvi;
    document.querySelector(".conditions .condition.cloud span").innerText = weather.current.clouds+" Clouds";
    document.querySelector(".conditions .condition.dew span").innerText = "Dew Point "+ convertTempFull(weather.current.dew_point);
    document.querySelector(".conditions .condition.vis span").innerText = "Visibility "+ weather.current.visibility;
    document.querySelector(".conditions .condition.hum span").innerText = "Humidity "+ weather.current.humidity+"%";
    document.querySelector(".conditions .condition.time span").innerText = diffFromNowSec(localStorage.weatherReloadTime);
    document.querySelector("header .temperature").innerHTML = convertTemp(weather.current.temp) + `<sup>°${localStorage.weatherTempType}</sup>`;
    document.querySelector("header .status span").innerHTML = weather.current.weather[0].description;
    document.querySelector("header .status img").src = "icon/weather/"+weather.current.weather[0].icon + ".png";
    document.querySelector(".main .riseSet .rise").innerText = "Sunrise " + secondToTime(weather.current.sunrise);
    document.querySelector(".main .riseSet .set").innerText = "Sunset " + secondToTime(weather.current.sunset);
    document.querySelector(".main .mainImg").src=`icon/illustration/${(weather.current.weather[0].main).toLowerCase()}.svg`;//"icon/illustration/"+(weather.current.weather[0].main)+".svg";

    //Set hourly Data
    var len = weather.hourly.length;
    for(i=0;i<len;i++){
        document.querySelector(".weatherContainer .weathers").innerHTML+=
        `<div class="weather press">
            <p class="temp">${convertTempFull(weather.hourly[i].temp)}</p>
            <p class="wind">${weather.hourly[i].wind_speed}km/h</p>
            <img src="icon/weather/${weather.hourly[i].weather[0].icon}.png">
            <p class="time">${secondToTime(weather.hourly[i].dt)}</p>
        </div>`;
    }
    //Set Daily Data
    len = weather.daily.length;
    for(i=0;i<len;i++){
        document.querySelector(".main .fiveDay").innerHTML+=
        `<div class="day">
            <div class="left">
                <img src="icon/weather/${weather.daily[i].weather[0].icon}.png">
                <p>${secondToDate(weather.daily[i].dt)} • ${weather.daily[i].weather[0].description}</p>
            </div>
            <div class="right">${convertTempFull(weather.daily[i].temp.max)} / ${convertTempFull(weather.daily[i].temp.min)} </div>
        </div>`;
    }

    //Set Sun's Position
    const sunrise = Number(weather.current.sunrise);
    const sunset = Number(weather.current.sunset);
    const current = weather.current.dt;
    interval = sunset - sunrise;
    c = current - sunrise;
    if((sunrise<current&&current<sunset)){
        document.querySelector(".landscape .sun").style.left = (c/interval)*100+"%";
    }
    else{
        //night
        // var sunRise = sunrise+(3600*24);
        // var sunSet = sunset+(3600*24);
        // interval = sunSet - sunrise;
        // c = current - sunRise;
        document.querySelector(".landscape .sun").style.left = 55+"%";
        document.querySelector(".landscape img.mountains").style.filter = "brightness(0.3)";
        document.querySelector(".landscape .imageDiv").style.backgroundColor='black';
        document.querySelector(".landscape .imageDiv").style.transition="5s ease-in-out background-color";
        setTimeout(() => {
            document.querySelector(".landscape .imageDiv").style.backgroundImage='url("image/stars.gif")';
        }, 5000);
        document.querySelector(".landscape .sun").src="icon/moon.png";
    }
    //alert(sunrise/1000 + " : " + current/1000 + " : " + sunset/1000);
    
    document.querySelector("header .options .unit span").innerText = "Change Unit : °"+localStorage.weatherTempType;
    
};


const changeUnit = ()=>{
    if(localStorage.weatherTempType == "C"){
        document.querySelector("header .options .unit span").innerText = "Change Unit : °F";
        localStorage.weatherTempType="F";
    }
    else if(localStorage.weatherTempType == "F"){
        document.querySelector("header .options .unit span").innerText = "Change Unit : °C";
        localStorage.weatherTempType="C";
    }
    location.reload();
    };



const diffFromNowSec = (time)=> {
    const now = new Date();
    const then = new Date(Number(time)*1000);
    const diff =  (now.getTime() - then.getTime())/1000;
    if(diff<0)
        return "Error!";
    else if(diff<=60&&diff>0)
        return diff.toFixed(0)+ " sec ago"
    else if(diff<3600&&diff>=60)
        return (diff/60).toFixed(0) + " min ago";
    else if(diff<3600*24&&diff>=3600)
        return (diff/(60*60)).toFixed(0) + " hour ago";
    else if(diff>=3600*24)
        return (diff/(60*60*24)).toFixed(0) + " day ago";
    else
        return "Reload Now !";
};

// localStorage.weatherTempType="C";
const convertTemp = (temp)=> {
    if(localStorage.weatherTempType=="C")
        temp=Math.round(Number(temp-273));
    else if(localStorage.weatherTempType=="F")
        temp=Math.round((temp-273.15)*9/5+32);
    return temp;
};
const convertTempFull = (temp)=>{
    return convertTemp(temp) + "°"+localStorage.weatherTempType;
}


const secondToTime = (time)=>{
    var t = new Date(Number(time)*1000);
    var h = t.getHours();
    var m = checkZero(t.getMinutes());
    var ap = "AM";
    if(h>12){
        h-=12;
        ap="PM";
    }else if(h==0){
        h=12;
    }
    return h+":"+m+ap;
};

const secondToDate = (time) => {
    var t = new Date(Number(time)*1000);
    var now = new Date();
    var dayList = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    if(t.getDate()==now.getDate())
        return "Today";
    else if(t.getDate()==now.getDate()+1)
        return "Tomorrow";
    else
        return dayList[t.getDay()];
};

const checkZero = (num) =>{
    if(num<10)
        num="0"+num;
    return num;
}


//Inportant data setup
if(!localStorage.weatherTempType)
    localStorage.weatherTempType="C";
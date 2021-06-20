const searchTxt = document.getElementById("searchTxt");
const button = document.getElementById("searchButton");
const sugg = document.getElementById("sugg");
var results = document.getElementById("results");
const none = document.getElementById("none");
//none.style.display="none";
let search = ()=>{
    var srarchName = searchTxt.value;
    searchTxt.value="";
    if(srarchName.length>=3){
        sugg.innerText = `Searching For "${srarchName}". . .`;
        //Api work Here
        var api = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${key}&q=`+srarchName;
        
        fetch(api)
        .then(responce => {
            return responce.json();
        })
        .then(data => {
            console.log(data);
            var len = data.length;
            if(len>=1){
                none.style.display="none";
                sugg.innerText = `${len} Results Found for "${srarchName}"`;
                results.innerText="";
                for(i=0;i<len;i++){
                    results.innerHTML+=`
                    <div class="result pressB" onclick="setData('${data[i]["LocalizedName"]}',${data[i]["GeoPosition"]["Longitude"]},${data[i]["GeoPosition"]["Latitude"]})">
                        <p class="name">${data[i]["EnglishName"]}</p>
                        <p class="details">${data[i]["AdministrativeArea"]["EnglishName"]}, ${data[i]["Country"]["EnglishName"]}</p>
                    </div>`;
                }
            }
            else{
                none.style.display="block";
                setTimeout(() => {
                    sugg.innerText = `No Results Found For ${srarchName}`;
                }, 1000);
            }
        });
        //Stored In data
    }
    else{
        searchTxt.focus();
    }
}
let inputed = (elem)=>{
    if(elem.value.length>=3)
        button.style.opacity="1";
    else
        button.style.opacity = "0.6";
};
searchTxt.addEventListener("input", ()=>{inputed(searchTxt);});
searchTxt.addEventListener("focus", ()=>{inputed(searchTxt);});
searchTxt.addEventListener("blur", ()=>{button.style.opacity="1";});



//Shou Network Not Available Page is Internet is not On
let checkOnline = ()=>{
    if(!navigator.onLine)
        $d.openPage("networkErr.html","right");
    setTimeout(() => {checkOnline();}, 500);
};
checkOnline();

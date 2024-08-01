const temperature=document.querySelector(".temp");
const locat=document.querySelector(".location");
const cit=document.querySelector(".city");
const yourwea=document.querySelector(".yourweather");
const searchwea=document.querySelector(".searchweather");
const sear=document.querySelector(".search");
const spe=document.querySelector(".speed");
const humid=document.querySelector(".value");
const per=document.querySelector(".percentage");
const usercontainer=document.querySelector(".weather-container");
const grantlocation=document.querySelector(".grant-location");
const formcontainer=document.querySelector(".form-container");
const loadingcontainer=document.querySelector(".loading-container");
const userinfocontainer=document.querySelector(".user-info-container");
const countryicon=document.querySelector(".data-country-icon");
const desc=document.querySelector(".data-weather-discription");
const weathericon=document.querySelector(".weater-icon");



let currenttab=yourwea;
const API_KEY="YOUR_API_KEY_HERE";
currenttab.classList.add("current-tab");
getfromsessionstorage();

function switchtab(clickedtab){
    if(clickedtab!=currenttab){
        currenttab.classList.remove("current-tab");
        currenttab=clickedtab;
        currenttab.classList.add("current-tab");

        if(!formcontainer.classList.contains('active')){
                userinfocontainer.classList.remove('active');
                grantlocation.classList.remove('active');
                formcontainer.classList.add('active');
            
        }
        else{
            formcontainer.classList.remove('active');
            userinfocontainer.classList.remove('active');
            getfromsessionstorage();
        }
    }

}


yourwea.addEventListener("click",()=>{
    switchtab(yourwea);
});

searchwea.addEventListener("click",()=>{
    switchtab(searchwea);
});

function getfromsessionstorage(){
  const localcoordinates=sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        grantlocation.classList.add('active');
    }
    else{
        const coordinates=JSON.parse(localcoordinates);
        fetchuserweatherinfo(coordinates);
    }

}

async function fetchuserweatherinfo(coordinates){
    const {lat,lon}=coordinates;
    grantlocation.classList.remove('active');
    
    loadingcontainer.classList.add('active');

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        console.log(response);
        const data=await response.json();
        loadingcontainer.classList.remove('active');
        userinfocontainer.classList.add('active');
        renderweatherinfo(data);
    }
    catch(e){
        loadingcontainer.classList.remove('active');

    }
}

function renderweatherinfo(weatherinfo){
    userinfocontainer.classList.add('active');
    cit.innerText=weatherinfo?.name;
    countryicon.src=`https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherinfo?.weather?.[0]?.description;
    weathericon.src= `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    temperature.innerText=`${weatherinfo?.main?.temp}°C`;
    spe.innerText=`${weatherinfo?.wind?.speed}m/s`;
    humid.innerText=`${weatherinfo?.main?.humidity}%`;
    per.innerText=`${weatherinfo?.clouds?.all}%`;
}




function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);

    }
    else{
        console.log("error");
    }
}

function showposition(position){
    const usercoordinate={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinate));
    fetchuserweatherinfo(usercoordinate);
}

const grantAccessButton = document.querySelector("#access");
grantAccessButton.addEventListener("click", getlocation);


formcontainer.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(sear.value===""){
        return ;
    }
    else{
        fetchsearchinfo(sear.value);
    }
});

async function fetchsearchinfo(city){
    loadingcontainer.classList.add('active');
    userinfocontainer.classList.remove('active');
    grantlocation.classList.remove('active');

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingcontainer.classList.remove('active');
        userinfocontainer.classList.add('active');
        renderweatherinfo(data);
    
    }
    catch(err){
        console.log(err);
    }

}





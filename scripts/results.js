//list of all countries in the Travelbreifing database
const countryList = [
    "Afghanistan","Aland Islands","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Azores","Bahamas","Bahrain","Balearic Islands","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bonaire","Bosnia and Herzegovina","Botswana","Bouvet Island","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Canary Islands","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos Islands","Colombia","Comoros","Congo-Brazzaville","Congo-Kinshasa","Cook Islands","Costa Rica","Croatia","Cuba","Curacao","Cyprus","Czech","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadaloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Heard Island and McDonald Islands","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Ivory Coast","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macao","Macedonia","Madagascar","Madeira","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia","Moldava","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Nagorno-Karabakh","Namibia","Nauru","Nepal","Netherlands","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","North Korea","Northern Cyprus","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saba","Saint Barthelemy","Saint Eustatius","Saint Helena","Saint Kitts and Nevis","Saint Lucia","Saint Martin-Dutch","Saint Martin-French","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","Somaliland","South Africa","South Georgia and the South Sandwich Islands","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Svalbard and Jan Mayen","Swaziland","Sweden","Switzerland","Syria","Tahiti","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands-British","Virgin Islands-US","Wallis and Futuna","Yemen","Zambia","Zimbabwe"
];

const countryInput = document.querySelectorAll(".country-input");
const autocomBox = document.querySelectorAll(".autocom-box");
const suggestions = document.querySelectorAll(".suggestions");

function showSuggestions(list, index) {
    if(list.length > 4) {
        for(i=0; i<4; i++) {
            suggestions[index].innerHTML += `${list[i]}`;
        }
    } else {
        list.forEach(item => {
            suggestions[index].innerHTML += `${item}`;
        });
    }
    autocomBox[index].classList.remove("hide");
}

countryInput.forEach(function(countryInput, currentIndex) {
    countryInput.addEventListener("input", function() {
        let input = countryInput.value.toUpperCase();
        let suggestionList = [];
        suggestions[currentIndex].innerHTML = "";

        //creat list of suggestions
        countryList.forEach(country => {
            if(country.toUpperCase().startsWith(input) && input.length != 0) {
                suggestionList.push(`<li class="suggestion"><span><i class="fas fa-globe-americas autocom-icon"></i></span>${country}</li>`);
            }
        });

        //display suggestions
        if (suggestionList.length != 0) {
            showSuggestions(suggestionList, currentIndex);
        } else {
            autocomBox[currentIndex].classList.add("hide");
        }

        //when a suggestion is clicked, add it to the input field
        let suggestion = suggestions[currentIndex].children;
        for (i=0; i<suggestion.length; i++) {
            suggestion[i].addEventListener("mousedown", function(){
                countryInput.value = this.innerText;
            });
        }

    });
    
    //hide suggestion box when the input loses focus
    countryInput.addEventListener("blur", function(){
        autocomBox[currentIndex].classList.add("hide");
    });
    
});

//store form data when the form is submitted
function getFormData() {
    let fromCountry = document.getElementById("from-country").value;
    let toCountry = document.getElementById("to-country").value;
    localStorage.setItem("fromCountry", fromCountry);
    localStorage.setItem("toCountry", toCountry);
}

//HTML Elements to update
const header_text_element = document.querySelector(".header-text");
const country_flag_element = document.querySelector(".country-info img");
const country_name_element = document.querySelector(".country-caption h3");
const neighboring_countries_element = document.querySelector(".country-caption .section-paragraph");
const travel_recommendations_element = document.querySelector("#travel-recommendations .component-body")
const languages_element = document.querySelector("#languages .component-body")
//const timezone_element = document.querySelector("#timezone .component-body")
//const visa_requirements_element = document.querySelector("#visa .component-body")
//const currency_element = document.querySelector("#currency .component-body")
const health_element = document.querySelector("#health .component-body")
const water_element = document.querySelector("#water .component-body")
const electricity_element = document.querySelector("#electricity .component-body")
const telephone_element = document.querySelector("#telephone .component-body")

let url = `https://travelbriefing.org/${localStorage.getItem("toCountry").replace(/ /g,"_")}?format=json`;
let countryFlag, countryName, neighbouringCountries, travelRecommendations, languages, /*timezone,*/ /*visa,*/ /*currency, currencyList*/ health, electricity;

//variables for Chart.js
let labels,tMin=[], tMax=[], tAvg=[], pMin=[], pMax=[], pAvg=[];

fetch(url)
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        countryFlagURL = `https://flagcdn.com/w320/${data["names"]["iso2"].toLowerCase()}.png`;
        countryName = data["names"]["full"];
        
        //neighbouring countries
        neighboringCountries = data["neighbors"].map((item, index) => {
            if(index == data["neighbors"].length - 1 && data["neighbors"].length > 1) {
                return `and <a class="paragraph-bold" href="">${item["name"]}</a>`;
            } else {
                return `<a class="paragraph-bold" href="">${item["name"]}</a>`;
            }
        }).join(", ");

        //travel recommendations
        travelRecommendations = ``;
        Object.keys(data["advise"]).forEach(source => {            
            travelRecommendations += `<p><span class="paragraph-bold">${data["advise"][source]["advise"]}</span><span class="subtext">${source} - <a class="paragraph-link" href=${data["advise"][source]["url"]}>Full Report</a></span></p>`;
        });

        //languages
        languages = data["language"].map((item, index) => {
            if(index == data["language"].length - 1 && data["language"].length > 1){
                return `and ${item["language"]}`;
            } else {
                return item["language"];
            }
        }).join(", ");
        
        /*
        //timezone
        timezone = data["timezone"]["name"];
        */

        //visaRequirements = data[]

        //water
        water = data["water"]["short"];

        //currency
        //currency = `The currency in ${data["names"]["name"]} is <span class="paragraph-bold">${data["currency"]["name"]} (${data["currency"]["code"]})</span>`;
        
        /*
        //obtain a list of all the currency
        currencyList = ``;
        for(i=0;i<data["currency"]["compare"].length;i++){
            currencyList += `<option rate="${data["currency"]["compare"][i]["rate"]}">${data["currency"]["compare"][i]["name"]}</option>`;
        }
        */

        //weather info
        labels = Object.keys(data["weather"]);
        labels.forEach(label => {
            tMin.push(data["weather"][label]["tMin"]);
            tMax.push(data["weather"][label]["tMax"]);
            tAvg.push(data["weather"][label]["tAvg"]);
            pMin.push(data["weather"][label]["pMin"]);
            pMax.push(data["weather"][label]["pMax"]);
            pAvg.push(data["weather"][label]["pAvg"]);
        });

        //health info
        if(data["vaccinations"].length < 1){
            health = `N/A`;
        } else{
            health = data["vaccinations"].map(item => {
                return `<p><span class="paragraph-bold">${item["name"]}</span><span class="subtext">${item["message"]}</span></p>`
            }).join(""); 
        }   

        //telephone
        telephone = Object.keys(data["telephone"]).map(item => {
            if(item == "calling_code") {
                return `<div class="phone-codes">Country Code: ${data["telephone"][item]}</div>`
            };
            return `<div class="phone-codes"><img src="/assets/images/${item}.svg">${data["telephone"][item]}</div>`
        }).join("");

        //electricity
        electricity = `<p><span class="paragraph-bold">Frequency:</span> ${data["electricity"]["frequency"]} Hz</p><p><span class="paragraph-bold">Voltage:</span> ${data["electricity"]["voltage"]} Volt</p><p><span class="paragraph-bold">Plugs:</span> ${data["electricity"]["plugs"].map(item => {return `Type ${item}`}).join(", ")}</p>`

    })
    .then( ()=> {
        updateUI();
        //update local storage when one of the neighbouring countries is clicked on
        document.querySelectorAll(".country-caption .section-paragraph a").forEach(item => {
            item.addEventListener("click", function(){
                localStorage.setItem("toCountry", item.innerHTML);
            });
        });
    })
    .catch(error => {
        alert("Error");
    })

function updateUI() {
    header_text_element.innerHTML = `Travel infomation for: ${localStorage.getItem("fromCountry")} to ${localStorage.getItem("toCountry")}`
    country_flag_element.src = countryFlagURL;
    country_name_element.innerHTML = `${countryName}`;
    neighboring_countries_element.innerHTML = `Other countries in the neighborhood of ${localStorage.getItem("toCountry")} are ${neighboringCountries}`;
    travel_recommendations_element.innerHTML = `${travelRecommendations}`;
    languages_element.innerHTML = `The languages spoken in ${localStorage.getItem("toCountry")} are ${languages}`;
    //timezone_element.innerHTML = timezone;
    //currency_element.innerHTML = currency;
    //document.querySelector(".currency-select").innerHTML = currencyList;
    health_element.innerHTML = health;
    water_element.innerHTML = `Drinking tap water in ${localStorage.getItem("toCountry")} is ${water}.`
    updateChart(labels,tMin,tMax,tAvg,pMin,pMax,pAvg);
    telephone_element.innerHTML = telephone;
    electricity_element.innerHTML = electricity;
}

//function that updates the weather charts
function updateChart(labels,tMin,tMax,tAvg,pMin,pMax,pAvg) {
    var ct1 = document.getElementById('temp-chart').getContext('2d');
    var ct2 = document.getElementById('precip-chart').getContext('2d');
    
    var tempChart = new Chart(ct1, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Max',
                data: tMax,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }, 
            
            {
                label: 'Min',
                data: tMin,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            },

            {
                label: 'Avg',
                data: tAvg,
                backgroundColor: [
                    'rgba(75, 200, 150, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 200, 150, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Average temperature (°C) in ${localStorage.getItem("toCountry").replace(/ /g,"_")} per month`,
                    align: 'center',
                    color: '#0d0e0e'
                },
                legend: {
                    display: 'true',
                    position: 'top'
                }
            }
        }
    });

    var precipChart = new Chart(ct2, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Max',
                data: pMax,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }, 
            
            {
                label: 'Min',
                data: pMin,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            },

            {
                label: 'Avg',
                data: pAvg,
                backgroundColor: [
                    'rgba(75, 200, 150, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 200, 150, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Average precipitation (mm) in ${localStorage.getItem("toCountry").replace(/ /g,"_")} per month`,
                    align: 'center',
                    color: '#0d0e0e'
                },
                legend: {
                    display: 'true',
                    position: 'top'
                }
            }
        }
    });
}

//when a country link is clicked, add it to local storage
document.querySelector(".country-caption .section-paragraph a").innerHTML = "cool";
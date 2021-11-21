/*
const countryList = [
    "Afghanistan","Aland Islands","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Azores","Bahamas","Bahrain","Balearic Islands","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bonaire","Bosnia and Herzegovina","Botswana","Bouvet Island","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Canary Islands","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos Islands","Colombia","Comoros","Congo-Brazzaville","Congo-Kinshasa","Cook Islands","Costa Rica","Croatia","Cuba","Curacao","Cyprus","Czech","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadaloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Heard Island and McDonald Islands","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Ivory Coast","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macao","Macedonia","Madagascar","Madeira","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia","Moldava","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Nagorno-Karabakh","Namibia","Nauru","Nepal","Netherlands","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","North Korea","Northern Cyprus","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saba","Saint Barthelemy","Saint Eustatius","Saint Helena","Saint Kitts and Nevis","Saint Lucia","Saint Martin-Dutch","Saint Martin-French","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","Somaliland","South Africa","South Georgia and the South Sandwich Islands","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Svalbard and Jan Mayen","Swaziland","Sweden","Switzerland","Syria","Tahiti","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands-British","Virgin Islands-US","Wallis and Futuna","Yemen","Zambia","Zimbabwe"
];
*/

//obtain list of all countries in the Travelbreifing database
const countryList = [];
fetch("https://travelbriefing.org/countries.json")
    .then(response => {
        return response.json();
    })
    .then(data => {
        data.forEach((element) => {
            countryList.push(element["name"]);
        })
        console.log(countryList);
    })
    .catch(error => {
        alert(error);
    })

//HTML elements for country search
const countryInput = document.querySelectorAll(".country-input");
const autocomBox = document.querySelectorAll(".autocom-box");
const suggestions = document.querySelectorAll(".suggestions");

//function that displays the country search suggestions when given a list of suggestions
function showSuggestions(list, index) {
    if(list.length > 4) { //if the list of suggestions is >4, only show up to 4 suggestions
        for(i=0; i<4; i++) {
            suggestions[index].innerHTML += `${list[i]}`;
        }
    } else {
        list.forEach(item => { //if the suggestions list is less that 4, show all suggestions
            suggestions[index].innerHTML += `${item}`;
        });
    }
    autocomBox[index].classList.remove("hide");
}

countryInput.forEach(function(countryInput, currentIndex) {
    //call the following function whenever there is an input to either of the two country input fields
    countryInput.addEventListener("input", function() {
        let input = countryInput.value.toUpperCase();
        let suggestionList = []; //initialze a list of suggestions to show the user
        suggestions[currentIndex].innerHTML = "";

        //create list of suggestions
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
    localStorage.setItem("toCountry", toCountry)
}
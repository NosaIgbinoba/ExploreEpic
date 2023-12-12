// Function to fetch cities by country using the countriesnow.space API
const getCitiesByCountry = async (name) => {
    return fetch('https://countriesnow.space/api/v0.1/countries/cities', {
        method: 'POST',
        body: JSON.stringify({ country: name }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => data.data)
    .catch(err => console.error(`Unable to get cities by country`, err))
}

// Get references to the HTML elements for country and cities
let countryElement = document.getElementById('country');
let citiesElement = document.getElementById('city');

getCitiesByCountry(countryElement.value)
    .then(data => callbackChange(data));

countryElement.addEventListener('change', (event) => {
    getCitiesByCountry(event.target.value).then(data => callbackChange(data));
});

// Callback function to update the cities dropdown based on fetched data
const callbackChange = (data) => {
    citiesElement.innerHTML = '';
    data.forEach(city => {
        let option = document.createElement('option');

        option.value = city;
        option.innerText = city;
        // Append the option to the cities dropdown
        citiesElement.appendChild(option);
    })
}
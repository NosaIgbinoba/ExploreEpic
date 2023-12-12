const getCitiesByCountry = async (name) => {
    // Make a POST request to the API with the country name
    return fetch('https://countriesnow.space/api/v0.1/countries/cities', {
        method: 'POST',
        body: JSON.stringify({ country: name }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    // Parse the JSON response and extract the data field
    .then(response => response.json())
    .then(data => data.data)
    // Log an error if fetching cities fails
    .catch(err => console.error(`Unable to get cities by country`, err))
}

// Get references to the HTML elements for country and cities
let countryElement = document.getElementById('country');
let citiesElement = document.getElementById('city');

// Initial fetch of cities based on the default country value
getCitiesByCountry(countryElement.value)
    .then(data => callbackChange(data));

// Add an event listener for the change event on the country element
countryElement.addEventListener('change', (event) => {
    // Fetch cities based on the selected country and invoke the callback
    getCitiesByCountry(event.target.value).then(data => callbackChange(data));
});

// Callback function to update the cities dropdown based on fetched data
const callbackChange = (data) => {
    citiesElement.innerHTML = '';
    // Populate the cities dropdown with new options based on the fetched data
    data.forEach(city => {
        let option = document.createElement('option');

        option.value = city;
        option.innerText = city;
        citiesElement.appendChild(option);
    })
}


document.getElementById("formt").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const dataObject = Object.fromEntries(formData.entries());
    const jsonData = JSON.stringify(dataObject);

    try {
      const response = await fetch("/submit", {
        method: "POST",
        body: jsonData,
        headers: {
            "Content-Type": "application/json"
        }
      });
  
      const data = await response.json();
  
      if (data.error) {
        alert(data.error);
      } else {
        // Handle success, maybe redirect or update the UI
        alert("Post submitted successfully!");
        window.location.href = "/blog";
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("An unexpected error occurred.");
    }
  });

document.addEventListener('DOMContentLoaded', function () {
    const blogContainer = document.getElementById('blogContainer');
    const allBlogPosts = Array.from(document.querySelectorAll('.blog_post'));
    const searchInput = document.querySelector('[name="search"]');

    searchInput.addEventListener('input', filterBlogPosts);

    function filterBlogPosts() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        allBlogPosts.forEach(blogPost => {
            const countryCity = blogPost.querySelector('h1').textContent.toLowerCase();
            const showPost = searchTerm === '' || countryCity.includes(searchTerm);
            blogPost.style.display = showPost ? 'block' : 'none';
        });
    }
});
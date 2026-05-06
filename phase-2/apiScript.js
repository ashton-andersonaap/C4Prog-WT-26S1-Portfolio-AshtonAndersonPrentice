    const checkboxes = document.querySelectorAll('input[name="APIs"]');
    const textInput = document.getElementById("inputfield");
    const APIoutput = document.getElementById("APIoutput");

    checkboxes.forEach(box => {
        box.addEventListener("change", () => {
        // Allow for only one checkbox to be selected
            checkboxes.forEach(cb => {
                if (cb !== box) cb.checked = false;
            });

            textInput.value = "";
            APIoutput.innerText = "";

            if (box.checked) {

                switch(box.value){
                    case "Password Generator":
                        textInput.placeholder = 'Enter Password Length '
                        break;
                    case "Planetary Data":
                        textInput.placeholder = "Enter Planet Identifier"
                        break;
                    
                }
            }

        });
    });

const form = document.querySelector("form");
form.addEventListener("submit", e => {
    e.preventDefault();

    const query = textInput.value;

    const selected = [...checkboxes].find(cb => cb.checked);

    if (!selected){
        APIoutput.innerText = "Please select an API";
        return;
    }
    callAPI(selected.value,query);
});



async function callAPI(apiType, query) 
{
    if (!query) {
        APIoutput.innerText = "Enter something in input field";
        return;
    }
    try {
        let url = "";

        //API Selection Based On Checkbox Value 
        if (apiType == "Password Generator"){
            url = `https://api.api-ninjas.com/v1/passwordgenerator?length=${query}`;

            const response = await fetch(url, {
            headers: {
                'X-Api-Key' : 'Fj79uvDYqvkWVRvdDoRojHjzryg3VeONoYCr8IWl'
            }
            });


            if (!response.ok) {
            APIoutput.innerText = `Error: ${response.status} ${response.statusText}`;
            return;
            }

            const data = await response.json()

            APIoutput.innerHTML = ` <h4>Generated Password</h4>

                                    <p style = "font-size: 10">${data.random_password || "No password Generated"}</p>`
        }


        else if (apiType == "Planetary Data"){

            url = `https://api.api-ninjas.com/v1/planets?name=${encodeURIComponent(query)}`;

            const response = await fetch(url, {
            headers: {
                'X-Api-Key' : 'Fj79uvDYqvkWVRvdDoRojHjzryg3VeONoYCr8IWl'
            }
            });

                if (!response.ok) {
                APIoutput.innerText = `Error: ${response.status} ${response.statusText}`;
                return;
                }
            
            const data = await response.json();
            const planet = data[0]
            if (planet && planet.name){
                APIoutput.innerHTML = `<h4>${planet.name}</h4> 
                                       <p>Mass: ${planet.mass || "Unknown"}</p>
                                       <p>Distance: ${planet.distance_light_year || "Unknown"} LY </p>
                                       <p>Orbital Period: ${planet.period || "Unknown"} Earth Days </p>`;
            } else {
                APIoutput.innerHTML = "No Planetary Data Found";
            }

        }
    }catch (error) {
        APIoutput.innerText = "Error Fetching Data";
        console.error(error);
    }

}
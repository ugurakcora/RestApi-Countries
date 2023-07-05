const countryApi = async (event) => {
  const api = `https://restcountries.com/v3.1/all`;
  const countries = document.querySelector(".countries");
  const regionSelect = document.getElementById("region-select");
  const searchInput = document.getElementById("search-input");
  const backButton = document.getElementById("backButton");

  await fetch(api)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      let filteredData = data;

      const filterCountries = () => {
        const selectedRegion = regionSelect.value.toLowerCase();
        const searchValue = searchInput.value.toLowerCase();

        filteredData = data.filter((country) => {
          const countryRegion = country.region.toLowerCase();
          const countryName = country.name.common.toLowerCase();

          return (
            (selectedRegion === "" || countryRegion === selectedRegion) &&
            (searchValue === "" || countryName.includes(searchValue))
          );
        });

        renderCountries();
      };

      regionSelect.addEventListener("change", filterCountries);
      searchInput.addEventListener("input", filterCountries);

      const renderCountries = () => {
        countries.innerHTML = "";

        filteredData.forEach((element) => {
          const { name, population, region, capital, flags } = element;

          let country = document.createElement("article");
          country.classList.add("country");

          let imageBtn = document.createElement("button");
          let countryDetails = document.createElement("div");
          let figure = document.createElement("figure");
          let img = document.createElement("img");

          img.src = flags.svg;
          img.alt = `${name.common}'s flag`;
          imageBtn.appendChild(figure);
          figure.appendChild(img);

          countryDetails.innerHTML = `
                <h2>${name.common}</h2>
                <p>Population: ${population.toLocaleString()}</p>
                <p>Region: ${region}</p>
                <p>Capital: ${capital}</p>
              `;

          country.appendChild(imageBtn);
          country.appendChild(countryDetails);
          countries.appendChild(country);

          imageBtn.addEventListener("click", function () {
            showModal(element);
          });
        });
      };

      renderCountries();
    })
    .catch((error) => console.log("Error:", error));
};

const showModal = (element) => {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  const countries = document.querySelector(".countries");
  modalContent.innerHTML = "";

  const { name, population, region, capital, flags } = element;

  const countryName = document.createElement("h2");
  countryName.textContent = name.common;

  const populationPara = document.createElement("p");
  populationPara.textContent = `Population: ${population.toLocaleString()}`;

  const regionPara = document.createElement("p");
  regionPara.textContent = `Region: ${region}`;

  const capitalPara = document.createElement("p");
  capitalPara.textContent = `Capital: ${capital}`;

  const flagImg = document.createElement("img");
  flagImg.src = flags.svg;
  flagImg.alt = `${name.common}'s flag`;

  modalContent.appendChild(flagImg);
  modalContent.appendChild(countryName);
  modalContent.appendChild(populationPara);
  modalContent.appendChild(regionPara);
  modalContent.appendChild(capitalPara);

  modal.style.display = "flex";
  countries.style.display = "none";
};

const closeModal = () => {
  const modal = document.getElementById("modal");
  const countries = document.querySelector(".countries");
  modal.style.display = "none";
  countries.style.display = "flex";
};

document.addEventListener("DOMContentLoaded", countryApi);

document.addEventListener("click", function (event) {
  if (event.target === document.getElementById("modal")) {
    closeModal();
  }
});

backButton.addEventListener("click", closeModal);

const darkMode = () => {
  document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.querySelector("#toggle");

    toggleSwitch.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    });
  });
};

darkMode();
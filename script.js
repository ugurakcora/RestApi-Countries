const apiUrl = "https://restcountries.com/v3.1/all";
const countriesContainer = document.querySelector(".countries");
const regionSelect = document.getElementById("region-select");
const searchInput = document.getElementById("search-input");
const backButton = document.getElementById("backButton");
const modal = document.getElementById("modal");

const fetchData = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Hata: Veri alınamadı");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Hata:", error);
    throw error;
  }
};

const filterCountries = (countries, selectedRegion, searchValue) => {
  return countries.filter((country) => {
    const countryRegion = country.region.toLowerCase();
    const countryName = country.name.common.toLowerCase();

    return (
      (selectedRegion === "" || countryRegion === selectedRegion) &&
      (searchValue === "" || countryName.includes(searchValue))
    );
  });
};

const renderCountries = (filteredData) => {
  countriesContainer.innerHTML = "";

  if (filteredData.length === 0) {
    const noResultsMessage = document.createElement("p");
    noResultsMessage.classList.add("no-results-message");
    noResultsMessage.textContent = "Sonuç Bulunamadı";
    countriesContainer.appendChild(noResultsMessage);
    return;
  }

  filteredData.forEach((element) => {
    const { name, population, region, capital, flags } = element;

    const country = document.createElement("article");
    country.classList.add("country");

    const imageBtn = document.createElement("button");
    const countryDetails = document.createElement("div");
    const figure = document.createElement("figure");
    const img = document.createElement("img");

    img.src = flags.svg;
    img.alt = `${name.common}'s flag`;
    imageBtn.appendChild(figure);
    figure.appendChild(img);

    countryDetails.innerHTML = `
      <h2>${name.common}</h2>
      <p>Population: ${population.toLocaleString()}</p>
      <p>Region: ${region}</p>
      ${capital ? `<p>Capital: ${capital}</p>` : ""}
    `;

    country.appendChild(imageBtn);
    country.appendChild(countryDetails);
    countriesContainer.appendChild(country);

    imageBtn.addEventListener("click", function () {
      showModal(element, filteredData);
    });
  });
};

const countryApi = async () => {
  try {
    const data = await fetchData();

    modal.style.display = "none";

    let filteredData = data;

    const filterCountriesHandler = () => {
      const selectedRegion = regionSelect.value.toLowerCase();
      const searchValue = searchInput.value.toLowerCase();

      filteredData = filterCountries(data, selectedRegion, searchValue);

      renderCountries(filteredData);
    };

    regionSelect.addEventListener("change", filterCountriesHandler);
    searchInput.addEventListener("input", filterCountriesHandler);

    renderCountries(filteredData);
  } catch (error) {
    console.error("Hata:", error);
    const filter = document.querySelector(".filters");
    filter.style.display = "none";
    modal.style.display = "none";
    const errorMessage = document.createElement("p");

    errorMessage.classList.add("no-results-message");
    errorMessage.textContent =
      "Servis hatası. Lütfen daha sonra tekrar deneyin.";
    countriesContainer.appendChild(errorMessage);
  }
};

const showModal = (element, filteredData) => {
  const modalContent = document.getElementById("modalContent");

  const {
    name,
    population,
    region,
    capital,
    flags,
    subregion,
    currencies,
    languages,
    borders,
  } = element;

  modalContent.innerHTML = "";

  const createParagraph = (className, textContent) => {
    const paragraph = document.createElement("p");
    paragraph.classList.add(className);
    paragraph.textContent = textContent;
    return paragraph;
  };

  const countryName = document.createElement("h2");
  countryName.textContent = name.common;

  const flagDiv = document.createElement("div");
  flagDiv.classList.add("flag");
  const flagImg = document.createElement("img");
  flagImg.src = flags.svg;
  flagImg.alt = `${name.common}'s flag`;
  flagDiv.appendChild(flagImg);

  const infoDiv = document.createElement("div");
  infoDiv.classList.add("info");

  infoDiv.appendChild(countryName);
  infoDiv.appendChild(
    createParagraph("native-name", `Native Name: ${name.official}`)
  );
  infoDiv.appendChild(
    createParagraph("population", `Population: ${population.toLocaleString()}`)
  );
  infoDiv.appendChild(createParagraph("region", `Region: ${region}`));
  infoDiv.appendChild(createParagraph("subregion", `Sub Region: ${subregion}`));

  if (capital) {
    infoDiv.appendChild(createParagraph("capital", `Capital: ${capital}`));
  }

  infoDiv.appendChild(
    createParagraph("tld", `Top Level Domain: ${element.tld}`)
  );

  if (currencies) {
    const currencyNames = Object.values(currencies).map(
      (currency) => currency.name
    );
    const currencySymbols = Object.values(currencies).map(
      (currency) => currency.symbol
    );
    infoDiv.appendChild(
      createParagraph(
        "currencies",
        `Currencies: ${currencyNames.join(", ")} (${currencySymbols.join(
          ", "
        )})`
      )
    );
  }

  if (languages) {
    const languageCodes = Object.keys(languages);
    const languageNames = Object.values(languages);
    infoDiv.appendChild(
      createParagraph(
        "languages",
        "Languages: " +
          languageCodes
            .map((code, index) => `${languageNames[index]}`)
            .join(", ")
      )
    );
  }

  const borderCountriesPara = document.createElement("p");
  borderCountriesPara.textContent = "Border Countries: ";

  const borderList = document.createElement("ul");
  borderList.classList.add("border-list");

  if (borders) {
    borders.forEach((borderCode) => {
      console.log(borderCode);
      const borderListItem = document.createElement("li");
      borderListItem.textContent = borderCode;
      borderList.appendChild(borderListItem);
    });
  } else {
    borderCountriesPara.style.display = "none";
    console.log("borders dizisi tanımlı değil veya undefined.");
  }

  infoDiv.appendChild(borderCountriesPara);
  infoDiv.appendChild(borderList);

  modalContent.appendChild(flagDiv);
  modalContent.appendChild(infoDiv);

  modal.style.display = "block";
  countriesContainer.style.display = "none";
};

const closeModal = () => {
  modal.style.display = "none";
  countriesContainer.style.display = "flex";
};

document.addEventListener("DOMContentLoaded", countryApi);

document.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

backButton.addEventListener("click", closeModal);

const darkMode = () => {
  const toggleSwitch = document.querySelector("#toggle");
  toggleSwitch.addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
  });
};

darkMode();

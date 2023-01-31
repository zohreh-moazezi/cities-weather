function get(url) {
  return new Promise(function (resolve, reject) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url);
    httpRequest.onload = function () {
      if (httpRequest.status === 200) {
        resolve(httpRequest.response);
      } else {
        reject(Error(httpRequest.statusText));
      }
    };
    httpRequest.onerror = function () {
      reject(Error("Network Error"));
    };

    httpRequest.send();
  });
}

function successHandler(data) {
  const dataObj = JSON.parse(data);
  //   const weatherDiv = document.querySelector("#weather");
  const div = `
        <h2 class="top">
        <img
            src="http://openweathermap.org/img/w/${dataObj.weather[0].icon}.png"
            alt="${dataObj.weather[0].description}"
            width="50"
            height="50"
        />${dataObj.name}
        </h2>
        <p>
          <span class="tempC">${tempToC(dataObj.main.temp)}&deg;</span> | 
          ${dataObj.weather[0].description}
        </p>
    `;
  return div;
  //   weatherDiv.innerHTML = weatherFragment;
}

function failHandler(status) {
  console.log(status);
}

function tempToC(kelvin) {
  return (kelvin - 273.15).toFixed(0);
}

document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "7ea8e959cebbba86bef1edd5c42ee827";
  // const apiKey = "";

  // Update

  const weatherDiv = document.querySelector("#weather");

  const locations = ["tehran", "mashhad", "mazandaran", "shiraz"];
  const urls = locations.map(function (location) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${apiKey}`;
  });

  Promise.all([get(urls[0]), get(urls[1]), get(urls[2]), get(urls[3])])
    .then(function (responses) {
      return responses.map(function (response) {
        return successHandler(response);
      });
    })
    .then(function (literals) {
      weatherDiv.innerHTML = `<h1>Weather</h1>${literals.join("")}`;
    })
    .catch(function (status) {
      failHandler(status);
    })
    .finally(function () {
      weatherDiv.classList.remove("hidden");
    });
});

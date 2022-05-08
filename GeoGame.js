import { countryObjects, shuffleArray, country2emoji2 } from "./countries.js";

/*
*****************************************************
    DECLARATIONS
*****************************************************
*/

const countriesArray = [...countryObjects];
const shuffleCountries = shuffleArray;
const countryFlag = country2emoji2;
const nextCountryBTN = document.querySelector(".nextCountry"); //Next Country Button
const newGameBTN = document.querySelector(".newGame"); //New Game Button
const currentCountry = document.querySelectorAll(".randomCountry *"); // Current Country Flage & Name
const roundCounter = document.querySelectorAll(".round > span")[1]; //Round
const scoreCounter = document.querySelectorAll(".score > span")[1]; //Score
const startGame = document.querySelector(".startGame"); //START GAME BUTTON
const globeOverlay = document.querySelector(".globeOverlay"); //GLOBE OVERLAY SPINNING EARTH
const countriesBoard = document.querySelector(".countriesBoard");
const flagContainer = document.createElement("div");
const flag = document.createElement("span");
const countryName = document.createElement("h4");
const progressBar = document.querySelector(".progressBarBG");
const okbtn = document.querySelector(".ok");
const cancelbtn = document.querySelector(".cancel");
const playMore = document.querySelector(".PlayMore");
const save = document.querySelector(".Save");
const keepPlaying = document.querySelector(".KeepPlaying");
const baitButton = document.querySelector(".Jabaite");
const HEAL = document.querySelector(".HEAL");
const DMG = document.querySelector(".DMG");
let randomCountryObj = 0;
let ScoreVariable = 0;
let RoundVariable = 1;
let validFlags = 0;
let invalidFlags = 0;
let bait = false;

let highScore = 0;
if (JSON.parse(localStorage.getItem("MyPoints"))) {
  highScore = JSON.parse(localStorage.getItem("MyPoints")).points;
} else {
  localStorage.setItem(
    "MyPoints",
    JSON.stringify({
      date: new Date().toLocaleDateString(),
      round: +roundCounter.textContent,
      points: ScoreVariable,
    })
  );
}

/*
*****************************************************
    EVENT LISTENERS
*****************************************************
*/
startGame.addEventListener("click", () => {
  globeOverlay.classList.add("fadeOut");
  setTimeout(() => {
    globeOverlay.style.display = "none";
  }, 1500);
});

/*
*****************************************************
    FUNCTIONS
*****************************************************
*/
/*RANDOM FLAG*/
const randomGen = () => Math.ceil(Math.random() * 250);
/*FETCH RANDOM COUNTRY*/
async function randomCountry() {
  let randomCountryTemp = countriesArray[randomGen()].code;
  let countryObject = await fetch(
    `https://restcountries.com/v3.1/alpha/${randomCountryTemp}`
  )
    .then((resp) => resp.json())
    .then((data) => {
      return data;
    });

  randomCountryObj = countryObject;
}

function runGame() {
  randomCountry()
    .then(() => {
      currentCountry[0].textContent = `${country2emoji2(
        randomCountryObj[0].altSpellings[0]
      )}`;
      currentCountry[1].textContent = `${randomCountryObj[0].name.common}`;
    })
    .then(() => {
      createNeightbours();
    });
}
runGame();
function createNeightbours() {
  let bordersArray = randomCountryObj[0].borders;
  let notNeightboursArray = [];
  let boardArray = [];
  if (bordersArray == undefined) {
    bait = true;
    // console.log("if ran", bait);
    bordersArray = [];
    for (let i = 0; i <= 8; i++) {
      notNeightboursArray.push(countriesArray[randomGen()].code);
    }
  } else {
    bait = false;
    // console.log(bait);
    for (let i = 0; i < bordersArray.length; i++) {
      notNeightboursArray.push(countriesArray[randomGen()].code);
      bordersArray[i] = countriesArray.find(
        (code2country) => code2country.code3 === bordersArray[i] //code3 border to code2 ps* twemojji does not work well
      ).code; // with code3 country , so i did change that.
    }
  }

  boardArray = [...bordersArray, ...notNeightboursArray];
  shuffleArray(boardArray);
  boardArray.forEach((country) => {
    let flagDiv = document.createElement("div");
    let flagSpan = document.createElement("span");
    let countryName = document.createElement("h5");
    flagDiv.className = bordersArray.includes(country)
      ? "emojiFlag neightbour"
      : "emojiFlag not_neightbour";

    flagSpan.textContent = `${country2emoji2(country)}`;
    countryName.textContent = `${
      countriesArray.find((countryObj) => countryObj.code === country).name
    }`;
    flagDiv.append(flagSpan, countryName);

    flagDiv.addEventListener(
      "click",
      (EVENT) => {
        if (
          Object.values(EVENT.currentTarget.classList).includes("neightbour")
        ) {
          EVENT.currentTarget.style.border = "2px solid green";
          ScoreVariable++;
          validFlags++;
          scoreCounter.textContent = ScoreVariable;
          progressBar.style.width = `${
            (validFlags / bordersArray.length) * 100
          }%`;
          if (validFlags == bordersArray.length) {
            document.querySelector(".warning").style.display = "block";
            document.querySelector(".foundem").style.display = "block";
          }
        } else {
          EVENT.currentTarget.style.border = "2px solid red";
          ScoreVariable--;
          scoreCounter.textContent = ScoreVariable;
          invalidFlags++;
          //   console.log(invalidFlags);
          if (invalidFlags == notNeightboursArray.length) {
            document.querySelector(".warning").style.display = "block";
            document.querySelector(".loser").style.display = "block";
          }
        }
      },
      { once: true }
    );
    countriesBoard.appendChild(flagDiv);
  });
  //   console.log(boardArray);
}

nextCountryBTN.addEventListener("click", () => {
  countriesBoard.innerHTML = "";
  runGame();
  RoundVariable++;
  roundCounter.textContent = RoundVariable;
  validFlags = 0;
  invalidFlags = 0;
  bait = false;
});

newGameBTN.addEventListener("click", () => {
  document.querySelector(".warning").style.display = "block";
  document.querySelector(".ok_cancel").style.display = "block";
});

okbtn.addEventListener("click", () => {
  document.querySelector(".warning").style.display = "none";
  document.querySelector(".ok_cancel").style.display = "none";
  roundCounter.textContent = 1;
  scoreCounter.textContent = 0;
  countriesBoard.innerHTML = "";
  progressBar.style.width = "0%";
  validFlags = 0;
  invalidFlags = 0;
  bait = false;
  ScoreVariable = 0;
  RoundVariable = 0;
  runGame();
});
cancelbtn.addEventListener("click", () => {
  document.querySelector(".warning").style.display = "none";
  document.querySelector(".ok_cancel").style.display = "none";
});

playMore.addEventListener("click", () => {
  document.querySelector(".warning").style.display = "none";
  document.querySelector(".foundem").style.display = "none";
  countriesBoard.innerHTML = "";
  progressBar.style.width = "0%";
  validFlags = 0;
  invalidFlags = 0;
  RoundVariable++;
  roundCounter.textContent = RoundVariable;
  bait = false;
  runGame();
});
save.addEventListener("click", () => {
  countriesBoard.innerHTML = "";
  if (highScore < ScoreVariable) {
    localStorage.setItem(
      "MyPoints",
      JSON.stringify({
        date: new Date().toLocaleDateString(),
        round: roundCounter.textContent,
        points: ScoreVariable,
      })
    );
  }

  document.querySelector(".warning").style.display = "none";
  document.querySelector(".foundem").style.display = "none";
  window.location.replace("https://www.google.com");
});

keepPlaying.addEventListener("click", () => {
  document.querySelector(".warning").style.display = "none";
  document.querySelector(".loser").style.display = "none";
  countriesBoard.innerHTML = "";
  progressBar.style.width = "0%";
  validFlags = 0;
  invalidFlags = 0;
  RoundVariable++;
  roundCounter.textContent = RoundVariable;
  bait = false;
  runGame();
});

baitButton.addEventListener("click", () => {
  if (bait === true) {
    ScoreVariable += 10;
    scoreCounter.textContent = ScoreVariable;
    countriesBoard.innerHTML = "";
    DMG_HEAL(bait);
    runGame();
  } else {
    ScoreVariable -= 20;
    scoreCounter.textContent = ScoreVariable;
    countriesBoard.innerHTML = "";
    DMG_HEAL(bait);
    runGame();
  }
});
//POP-UP window and buttons (ok-cancel)

/************************************************************************************ */
/* HIGHSCORE localStorage*/
document.querySelector(".highscore").textContent += `Points : ${
  JSON.parse(localStorage.getItem("MyPoints")).points
}  Rounds : ${JSON.parse(localStorage.getItem("MyPoints")).round}`;

/* DMG - HEAL */
function DMG_HEAL(inpt) {
  if (inpt === true) {
    HEAL.style.display = "block";
    HEAL.style.opacity = "1";
    setTimeout(() => {
      HEAL.style.opacity = "0";
      setTimeout(() => {
        HEAL.style.display = "none";
      }, 400);
    }, 400);
  } else {
    DMG.style.display = "block";
    DMG.style.opacity = "1";
    setTimeout(() => {
      DMG.style.opacity = "0";
      setTimeout(() => {
        DMG.style.display = "none";
      }, 400);
    }, 400);
  }
}

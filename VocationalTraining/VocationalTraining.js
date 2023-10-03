const sections = document.querySelectorAll(".section");
const vocationalTrainingSlider = document.getElementById("vocationalTraining");
const participationRateSlider = document.getElementById("participationRate");
const startButton = document.getElementById("startButton");
const setupButton = document.getElementById("setupButton");
const resetButton = document.getElementById("resetButton");

let simulationRunning = false;
let startTime = 0;

function updateSliderValue(sliderId, valueId) {
  const slider = document.getElementById(sliderId);
  const value = document.getElementById(valueId);
  value.textContent = slider.value;
}

vocationalTrainingSlider.addEventListener("input", () => {
  updateSliderValue("vocationalTraining", "vocationalTrainingValue");
  updateStartButtonState();
});

participationRateSlider.addEventListener("input", () => {
  updateSliderValue("participationRate", "participationRateValue");
  updateStartButtonState();
});

function updateStartButtonState() {
  const vocationalTrainingValue = parseInt(vocationalTrainingSlider.value);
  const participationRateValue = parseInt(participationRateSlider.value);

  if (vocationalTrainingValue === 0 || participationRateValue === 0) {
    startButton.disabled = true;
  } else {
    startButton.disabled = false;
  }
}

function disableControls() {
  startButton.disabled = true;
  vocationalTrainingSlider.disabled = true;
  participationRateSlider.disabled = true;
  setupButton.disabled = true;
  startTime = new Date().getTime();
}

function enableControls() {
  startButton.disabled = false;
  vocationalTrainingSlider.disabled = false;
  participationRateSlider.disabled = false;
  setupButton.disabled = false;
}

function updateBlackBoxes(numBoxes) {
  sections.forEach((section) => {
    const blackBoxes = section.querySelectorAll(".black-box");

    if (blackBoxes.length > numBoxes) {
      for (let i = numBoxes; i < blackBoxes.length; i++) {
        section.removeChild(blackBoxes[i]);
      }
    } else if (blackBoxes.length < numBoxes) {
      const numToAdd = numBoxes - blackBoxes.length;
      for (let i = 0; i < numToAdd; i++) {
        const blackBox = document.createElement("div");
        blackBox.className = "black-box";

        const sectionWidth = section.clientWidth - 10;
        const sectionHeight = section.clientHeight - 10;
        const x = Math.random() * sectionWidth;
        const y = Math.random() * sectionHeight;

        blackBox.style.left = `${x}px`;
        blackBox.style.top = `${y}px`;
        section.appendChild(blackBox);
      }
    }
  });
}

function removeWhiteCirclesAfterSimulation() {
  const circleContainers = document.querySelectorAll(".circle-container");
  const participationRate = parseInt(participationRateSlider.value);

  circleContainers.forEach((circleContainer) => {
    const circles = circleContainer.querySelectorAll(".circle");
    const numToRemove = Math.min(participationRate, circles.length);

    for (let i = 0; i < numToRemove; i++) {
      circles[i].remove();
    }
  });
}

function updateSimulationTime() {
  if (simulationRunning) {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;

    const seconds = Math.floor(elapsedTime / 1000);
    const milliseconds = elapsedTime % 1000;

    const simulationTimeField = document.getElementById("simulationTime");
    simulationTimeField.value = `${seconds}s ${milliseconds}ms`;
  }
}

participationRateSlider.addEventListener("input", () => {
  startTime = 0;
  updateSimulationTime();
});

function startSimulation() {
  if (!simulationRunning) {
    simulationRunning = true;
    disableControls();

    const circleContainers = document.querySelectorAll(".circle-container");
    const circlesToRemove = document.querySelectorAll(".circle");

    const totalCircles = circlesToRemove.length;
    const totalBoxes = parseInt(vocationalTrainingSlider.value);
    const participationRate = parseInt(participationRateSlider.value);

    const trianglesAddedCounts = new Array(circleContainers.length).fill(0);
    const removalInterval =
      30000 / Math.max(totalCircles, totalBoxes) / (participationRate / 100);

    let circleIndex = 0;
    let boxIndex = 0;

    const intervalId = setInterval(() => {
      if (circleIndex < totalCircles) {
        const circleContainer = circleContainers[circleIndex];

        if (circleContainer) {
          const circles = circleContainer.querySelectorAll(".circle");

          if (circles.length > 0) {
            circlesToRemove[circleIndex].remove();
            const numTrianglesToAdd = Math.min(participationRate, circles.length);
            for (let i = 0; i < numTrianglesToAdd; i++) {
              const triangle = document.createElement("div");
              triangle.className = "triangle";
              const x = Math.random() * 80 + 10;
              const y = Math.random() * 80 + 10;
              triangle.style.left = `${x}%`;
              triangle.style.top = `${y}%`;
              circleContainer.appendChild(triangle);

              const sectionIndex = Array.from(sections).indexOf(circleContainer.closest(".section"));
              if (sectionIndex >= 0) {
                trianglesAddedCounts[sectionIndex]++;
              }
            }
          }
        }

        circleIndex++;
      }

      if (boxIndex < totalBoxes) {
        updateBlackBoxes(boxIndex + 1);
        boxIndex++;
      } else if (circleIndex >= totalCircles) {
        clearInterval(intervalId);
        simulationRunning = false;
        enableControls();
        removeWhiteCirclesAfterSimulation();
        updateSimulationTime();
      }
    }, removalInterval);
  }
}

setupButton.addEventListener("click", () => {
  const colors = ["#FF5733", "#33FF57", "#5733FF", "#FF33D4"];

  sections.forEach((section, index) => {
    section.style.backgroundColor = colors[index];
    const circleContainer = section.querySelector(".circle-container");
    const numCircles = 100;
    for (let i = 0; i < numCircles; i++) {
      const circle = document.createElement("div");
      circle.className = "circle";
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 80 + 10;
      circle.style.left = `${x}%`;
      circle.style.top = `${y}%`;
      circleContainer.appendChild(circle);
    }

    const initialBoxValue = parseInt(vocationalTrainingSlider.value);
    updateBlackBoxes(initialBoxValue);
  });
});

startButton.addEventListener("click", startSimulation);

resetButton.addEventListener("click", resetSettings);

updateBlackBoxes(0);
updateSliderValue("vocationalTraining", "vocationalTrainingValue");
updateSliderValue("participationRate", "participationRateValue");
updateStartButtonState();

function resetSettings() {
  location.reload();
}

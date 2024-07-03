class App {
  constructor() {
    //   elements
    this.userInput = document.querySelector("#user-input");
    this.resultsDiv = document.querySelector("#results-div");
    this.checkbtn = document.querySelector("#check-btn");
    this.clearBtn = document.querySelector("#clear-btn");

    //   stateVariables
    this.results = [];

    // initial state
    this.initialize();

    //   eventlisteners
    this.checkbtn.addEventListener("click", this.operateOnInput.bind(this));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.operateOnInput(e);
    });

    this.clearBtn.addEventListener("click", this.clearResultsDiv.bind(this));
  }

  // FUNCTIONS
  initialize() {
    this.results = JSON.parse(localStorage.getItem("results"));
    if (this.results) {
      this.results.forEach((entry) => this.render(entry[0], entry[1]));
    } else {
      this.results = [];
    }
  }

  operateOnInput(e) {
    e.preventDefault();
    let number = this.userInput.value;
    if (number === "") {
      alert("Please provide a phone number");
      return;
    }

    this.userInput.value = "";
    let status = this.validate(number) ? "Valid" : "Invalid";
    this.render(status, number);
    this.saveResult(status, number);
  }

  validate(str) {
    let regex = /^(1\s?)?(\(\d{3}\)|\d{3})[-\s]?(\d{3})[-\s]?(\d{4})$/;
    return regex.test(str);
  }

  render(status, number) {
    const borderClass = status === "Valid" ? "validnumber" : "invalidNumber";
    const icon =
      status === "Valid"
        ? `<i class="fa-solid fa-circle-check" style="color: #32e43581;"></i>`
        : `<i class="fa-solid fa-circle-xmark" style="color: #ff0d0d81;"></i>`;
    let html = `
          <div class="entry ${borderClass}">
            ${icon}
            <p class="para">${status} US number: ${number}</p>
            
          </div> 
      `;

    //  <p class="entry">"${status} US number: ${number}</p>
    this.resultsDiv.insertAdjacentHTML("afterbegin", html);
  }

  clearResultsDiv(e) {
    e.preventDefault();
    this.resultsDiv.innerHTML = "";
    localStorage.clear("results");
    this.results = [];
  }

  saveResult(status, number) {
    if (this.results.length >= 5) {
      this.results.shift();
    }
    this.results.push([status, number]);
    localStorage.setItem("results", JSON.stringify(this.results));
  }
}

const app = new App();

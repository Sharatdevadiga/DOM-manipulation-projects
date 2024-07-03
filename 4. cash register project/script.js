//ELEMENTS
// input elements
const totalPriceEl = document.querySelector(".total");
const cashEl = document.querySelector("#cash");

// button elements
const purchaseBtn = document.querySelector("#purchase-btn");
const totalBtn = document.querySelector(".total-btn");

const changeDue = document.querySelector(".change-due");
const tableEl = document.querySelector(".table");
const refillDrawerBtn = document.querySelector(".refill-drawer-btn");

// output elements
const outputDivEl = document.querySelector(".output-div");
const cashDraawer = document.querySelector(".output");
const outputTotalPrice = document.querySelector(".output-total-price");
const outputChangeDue = document.querySelector(".output-change-due");
const outputCashGiven = document.querySelector(".output-cash-given");

// DATA
let cash = 0;
let price = 0;
let changeDueVal;
let change = [];
let scrollElement = outputDivEl;

let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];
let cidClone = cid.map((entry) => [...entry]);
let changeValues = {
  PENNY: 0.01,
  NICKEL: 0.05,
  DIME: 0.1,
  QUARTER: 0.25,
  ONE: 1,
  FIVE: 5,
  TEN: 10,
  TWENTY: 20,
  "ONE HUNDRED": 100,
};

// //////////////////////////////////////////////////////////////
// sCROLL INTO VIEW
function scrollToSection(section) {
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// READING VALUES
function getValues() {
  price = parseFloat(totalPriceEl.value).toFixed(2);
  cash = parseFloat(cashEl.value).toFixed(2);
}

// displaying cid
function generateCidTable() {
  tableEl.innerHTML = "";
  let tableHtml = `
        <table class="cid-table">
          <thead>
            <tr>
              <th>Currency</th>
              <th>Amount available</th>
            </tr>
          </thead>
        
  `;

  for (let i = 0; i < cid.length; i++) {
    let coin = cid[i][0];
    let value = changeValues[coin];
    let amount = cid[i][1];
    tableHtml += `
      <tr>
          <td>${coin} ($${value})</td>
          <td>$${amount}</td>
        </tr>
    
    `;
  }
  tableHtml += `</table>`;

  tableEl.innerHTML = tableHtml;
}

// GENERATING CHANGE TABLE
function generateChangeTable() {
  changeDue.innerHTML = "";
  let dueChange =
    (cash - price).toFixed(2) > 0 ? (cash - price).toFixed(2) : "No due";
  let tableHtml = `
        <table class="cash-table">
          <thead>
            <tr>
              <th>Currency</th>
              <th>Count</th>
              <th>Amount</th>
            </tr>
          </thead>
        
  `;

  for (let i = 0; i < change.length; i++) {
    let [curChangeName, curChangeAmount, curChangeRequired, curChangeVal] =
      change[i];
    tableHtml += `
      <tr>
          <td>${curChangeName} ($${curChangeVal})</td>
          <td>${curChangeRequired}</td>
          <td>$${curChangeAmount}</td>
        </tr>
    
    `;
  }
  tableHtml += `
        <tr>
          <td>Total</td>
          <td></td>
          <td>$${dueChange}</td>
        </tr>
  
        </table>`;

  changeDue.innerHTML = tableHtml;
}

// updating billing table
function updateBillTable() {
  let dueChange =
    (cash - price).toFixed(2) > 0 ? (cash - price).toFixed(2) : "No due";
  outputTotalPrice.textContent = price;
  outputChangeDue.textContent = dueChange;
  outputCashGiven.textContent = cash;
}

// INITIALIZING FUNCTION
function init() {
  totalPriceEl.setAttribute("placeholder", `total = ${price}`);
  generateCidTable();
}
init();

// PRICE TABLE
function updatePrice() {
  let priceVal = parseFloat(totalPriceEl.value).toFixed(2);
  let regexNum = /^\d*\.?\d+$/;
  if (!regexNum.test(priceVal))
    alert("invalid total price!. Enter a valid price");
  else {
    price = priceVal;
  }
}

// MAIN LOGIC
function checkCashRegister(price, cash, cid) {
  // variables
  change = [];
  changeDueVal = cash - price;
  let cidTotal = Number(cid.reduce((sum, val) => sum + Number(val[1]), 0));

  // case1
  if (cidTotal < changeDueVal) {
    alert("Insufficient funds!! refill the drawer");
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  // case 2
  if (cidTotal == changeDueVal) {
    return { status: "CLOSED", change: cid };
  }

  // case3
  if (cidTotal > changeDueVal) {
    console.log("calculating");
    console.log(cid);
    for (let i = cid.length - 1; i >= 0; i--) {
      let curChangeName = cid[i][0];
      let curChangeAmount = cid[i][1];
      let curChangeVal = changeValues[curChangeName];
      let curChangeRequired = 0;

      // calculate curent change required
      while (changeDueVal >= curChangeVal && curChangeAmount > 0) {
        changeDueVal = Number(changeDueVal - curChangeVal).toFixed(2);
        curChangeAmount = Number(curChangeAmount - curChangeVal).toFixed(2);
        curChangeRequired += 1;
      }
      // if current change is needed then consider it
      if (curChangeRequired > 0) {
        change.push([
          curChangeName,
          curChangeRequired * curChangeVal,
          curChangeRequired,
          curChangeVal,
        ]);
        // update cid
      }
    }

    //  if still unable to give suitable change then---
    if (changeDueVal > 0) {
      alert("Insufficient funds!! refill the drawer");
      return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    //   if correct change was given
    updateCid(change);
    console.log(`change from main logic `);
    console.log(change);
    return { status: "OPEN", change: change };
  }
}

// UPDATING CID FUNCTION
function updateCid(change) {
  for (let entryChange of change) {
    let [changeCurrency, changeAmount] = entryChange;
    for (let i = 0; i < cid.length; i++) {
      let [cidCurrency, cidAmount] = cid[i];
      if (cidCurrency === changeCurrency) {
        cid[i][1] = (cidAmount - changeAmount).toFixed(2);
      }
    }
  }
  generateCidTable();
}

// GETTING THE DESIRED RESULT IN THE FORM OF A STRING
// function getresultStr() {
//   // get the result object from main logic
//   let { status, change } = checkCashRegister(price, cash, cid);
//   let displayStr = `Status: ${status}`;

//   // construct required string output
//   for (let entry of change) {
//     displayStr += ` ${entry[0]}: $${entry[1]}`;
//   }

//   return displayStr;
// }

// UPDATING UI
function updateUI() {
  getValues();
  if (+price > +cash) {
    console.log(+price, +cash);
    alert("Customer does not have enough money to purchase the item");
  } else if (+price == +cash) {
    changeDue.textContent = "No change due - customer paid with exact cash";
    return;
  } else {
    console.log("update ui function executed");
    checkCashRegister(+price, +cash, cid);
    console.log(change);

    console.log("calling main logic");
    // if (res["status"] && res["status"] === "INSUFFICIENT_FUNDS")
    //   scrollElement = cashDraawer;
  }
}

//RESETTING EVERYTHING
function reset() {
  console.log("RESETTING WINDOW");
}
// --------------------------------------------------
// EVENTLISTENERS

// HELPER FUNCTIONS for eventlisteners
function handlePurchase() {
  getValues();
  updatePrice();
  updateUI();
  generateCidTable();

  updateBillTable();
  generateChangeTable();
  resetInputs();
}

function resetInputs() {
  totalPriceEl.value = "";
  totalPriceEl.setAttribute("placeholder", `total = ${price}`);
  cashEl.setAttribute("placeholder", `cash In = ${cash}`);
  cashEl.value = "";
}
// function updatePriceValue() {
//   price = totalPriceEl.value ? totalPriceEl.value : 1.85;
// }

// purchasing event
purchaseBtn.addEventListener("click", () => {
  handlePurchase();
  resetInputs();
  scrollToSection(scrollElement);
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handlePurchase();
    resetInputs();
    scrollToSection(scrollElement);
    console.log(change);
  }
});

// total btn - price update eventlistener
totalBtn.addEventListener("click", (e) => {
  updatePrice();
});

// refill drawer
refillDrawerBtn.addEventListener("click", () => {
  cid = cidClone.map((entry) => [...entry]);
  generateCidTable();
});

// // ////////////////////////////////////////////////
// // testing
// function logResult() {
//   console.log(cashEl);
//   console.log(changeDue);
//   console.log(purchaseBtn);
// }
// logResult();
// // ///////////////////////////////////////////////////

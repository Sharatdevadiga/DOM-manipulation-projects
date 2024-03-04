// elements
const textInput = document.getElementById("text-input");
const checkBtn = document.getElementById("check-btn");
const resultEL = document.getElementById("result");

// palindrome checker function
const isPalindrome = function (s) {
  const regex = /[a-zA-Z0-9]/;

  let l = 0,
    r = s.length - 1;

  while (l < r) {
    while (l < r && !regex.test(s[l])) ++l;
    while (l < r && !regex.test(s[r])) --r;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;

    l += 1;
    r -= 1;
  }
  return true;
};

function renderResult(res) {
  let html = `<p class="output-descreption">${res}</p>`;
  resultEL.innerHTML = html;
}

// callback function for event listener
function outputRes() {
  resultEL.innerHTML = "";
  if (textInput.value == "") {
    alert("Please input a value");
  } else {
    let outputStr = isPalindrome(textInput.value)
      ? `<strong>${textInput.value}</strong> is a palindrome`
      : `<strong>${textInput.value}</strong> is not a palindrome`;
    renderResult(outputStr);
  }
}
// eventlisteners
checkBtn.addEventListener("click", (e) => {
  outputRes();
});

document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    outputRes();
  }
});

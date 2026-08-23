document.addEventListener("DOMContentLoaded", function () {
  checkUserSession();
});

function checkUserSession() {
  const user = localStorage.getItem("loggedInUser");
  const navLoginBtn = document.getElementById("navLoginBtn");
  const userGreeting = document.getElementById("userGreeting");

  if (!navLoginBtn || !userGreeting) return;

  if (user) {
    navLoginBtn.style.display = "none";
    userGreeting.style.display = "inline-block";
    userGreeting.innerHTML =
      "Welcome, " + escapeHtml(user) +
      ' | <a onclick="logout()" style="color:#ffffff; font-weight:normal; text-decoration:underline; cursor:pointer;">Logout</a>';
  } else {
    navLoginBtn.style.display = "inline-block";
    userGreeting.style.display = "none";
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  checkUserSession();
  alert("You have logged out.");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

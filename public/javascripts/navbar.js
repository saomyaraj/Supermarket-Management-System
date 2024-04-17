
const expand_btn = document.querySelector(".expand-btn");

let activeIndex;

expand_btn.addEventListener("click", () => {
  document.body.classList.toggle("collapsed");
});

const current = window.location.href;

const allLinks = document.querySelectorAll(".sidebar-links a");

allLinks.forEach((elem) => {
  elem.addEventListener("click", function () {
    const hrefLinkClick = elem.href;

    allLinks.forEach((link) => {
      if (link.href == hrefLinkClick) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  });
});

const searchInput = document.querySelector(".search__wrapper input");

searchInput.addEventListener("focus", (e) => {
  document.body.classList.remove("collapsed");
});
document.getElementById('logout-func').addEventListener('click',function(){
  fetch('/logout', {
    method: 'POST',
})
.then(response => {
    if (response.ok) {
        // Category added successfully, you can handle the response here
      console.log("loggedout")
      window.location.href = '/adminlogin';



    } else {
        // Handle errors
        alert("Error adding category. Please try again later.");
    }
})
.catch(error => {
    // Handle network errors
    console.error('Error adding category:', error);
    alert("Network error. Please try again later.");
});
})
function handleParentPortal() {
  console.log("hello world");
}

// I just noticed the JS test included creating the carousel. I didn't need js for it
// because my first thought was to impliment one in CSS to avoid bugs etc.
//
// What I WOULD do if I used JS would be to get an array of all images --> Array.from(decoument.querySelectorAll("carousel-img"))
// align them next to eachother, somthing like
//
//                                images.forEach((image, index) => image.style.transform = `translateX(${index * img width}px)`)
//
//
// and then set a timer to translate the images every 5 seconds via
//
//                                setInterval((translate right however many px)=>, 5000))
//
// then, get the image that left the container (which is the head of the array) and translate it all the way to the left,
//
//                                 so like translateX(-img-width * imgages.length))
//
// something along those lines
let modal_wrapper = document.getElementById("modal_wrapper");
let modal = document.querySelector(".modal_container");
let modalCloseBtn = document.querySelector("#modal-btn");
let modalFormSubmitBtn = document.querySelector("#modal-form-submit-btn");

let parentPortal = document.getElementById("parent_portal");

let stayUpdatedForm = document.getElementById("stay_updated_form");

// ***** Handle Modal Actions. *****
const closeModal = () => {
  // close modal helper fn
  modal_wrapper.classList.replace("shown", "hidden");
  modal.classList.replace("slideIn", "slideOut");
};

modalCloseBtn.onclick = () => {
  modal_wrapper.classList.replace("shown", "hidden");
  modal.classList.replace("slideIn", "slideOut");
};

// this checks if the click is within the modal or not, if it isn't, it closes the modal
window.addEventListener("click", (event) => {
  if (!modal.contains(event.target)) {
    closeModal();
  }
});

// this removes the modal from dom when the modal fades out
window.addEventListener("animationend", (event) => {
  // when done fading in, keep opacity at 1
  if (event.animationName === "fadeIn")
    modal_wrapper.classList.replace("modal_default", "shown");

  // when done fading out, remove from DOM
  if (event.animationName === "fadeOut") modal_wrapper.style.display = "none";
});

// To add basic auth, I'll use a simple cookie, set by the modal. If the cookie exists, the user can navigate
//  else, the user is redirected to the homepage.

// handle submit button

const modalForm = document.querySelector("#modal_form");
const modalFormBtn = document.querySelector("#modal-form-submit-btn");

console.log(modalFormBtn);
modalFormBtn.onclick = (event) => {
  event.preventDefault();
  // get form data and create a cookie (obviously not the best practice to set password directly as a cookie. This could be a jwt or something if its real auth)
  let formData = new FormData(modalForm);
  let password = formData.get("password");
  let buff = btoa(password); //btoa is deprecated, but couldnt find a reliable way to encode a string on client side. (cant use Buffer methods)
  console.log(buff);
  document.cookie = `password=${buff}`;
  closeModal();
};

// handle parent portal click

parentPortal.onclick = async () => {
  let headers = new Headers(); // create new header object and append with DOM data.

  headers.set(
    "Authorization",
    "Basic " + document.cookie // create basic auth header with encoded data...
  );

  const isCookieSet = await (
    await fetch("http://localhost:8080/api/auth", {
      method: "GET",
      headers: headers,
    })
  ).json();

  console.log(isCookieSet);

  if (isCookieSet.status === 200) {
  }

  if (isCookieSet.status === 401) {
    let error_modal = document.querySelector("#error_modal");
    error_modal.innerHTML = "Error: Not Authorized!";
    error_modal.classList.add("popup");
  }
};

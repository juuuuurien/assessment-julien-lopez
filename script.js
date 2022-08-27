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
let modalBtn = document.querySelector("#modal-btn");

let parentPortal = document.getElementById("parent_portal");
parentPortal.onclick = handleParentPortal;

let stayUpdatedForm = document.getElementById("stay_updated_form");

modalBtn.onclick = () => {
  modal_wrapper.classList.replace("shown", "hidden");
  modal.classList.replace("slideIn", "slideOut");
};

window.addEventListener("click", (event) => {
  if (!modal.contains(event.target)) {
    modal_wrapper.classList.replace("shown", "hidden");
    modal.classList.replace("slideIn", "slideOut");
  }
});

window.addEventListener("animationend", (event) => {
  // when done fading in, keep opacity at 1
  if (event.animationName === "fadeIn")
    modal_wrapper.classList.replace("modal_default", "shown");

  // when done fading out, remove from DOM
  if (event.animationName === "fadeOut") modal_wrapper.style.display = "none";
});

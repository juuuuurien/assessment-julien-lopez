function handleParentPortal() {
  console.log("hello world");
  console.log(process.env.PUBLIC_URL);
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
let modalForm = document.querySelector("#modal_form");
let modalFormBtn = document.querySelector("#modal-form-submit-btn");
let parentPortalBtn = document.querySelector("#parent_portal");
let subscribeButton = document.querySelector("#subscribe_btn");
let subscribeForm = document.querySelector("#stay_updated_form");
let subscribeErrors = document.querySelector("#subscribe_errors");

let popup = document.querySelector("#popup");

let stayUpdatedForm = document.getElementById("stay_updated_form");

// ***** Handle Modal Actions. *****
const openModal = () => {
  // open modal helper fn
  modal_wrapper.style.display = "flex";
  modal_wrapper.classList.replace("hidden", "modal_default");
  modal.classList.replace("slideOut", "slideIn");
};

const closeModal = () => {
  // close modal helper fn
  modal_wrapper.classList.replace("shown", "hidden");
  modal.classList.replace("slideIn", "slideOut");
};

if (modal !== null) {
  // Parent portal button and modal could be null, so I'm checking here. In a real app, I'd just use different modules for each page
  modalCloseBtn.onclick = () => {
    closeModal();
  };

  // This checks if the click is within the modal or not, if it isn't, it closes the modal
  window.addEventListener("click", (event) => {
    if (!modal.contains(event.target)) {
      closeModal();
    }
  });

  // This listener removes the modal from dom when the modal fades out
  window.addEventListener("animationend", (event) => {
    if (event.animationName === "fadeIn")
      modal_wrapper.classList.replace("modal_default", "shown");
    if (event.animationName === "fadeOut") modal_wrapper.style.display = "none";
    if (event.animationName === "popup") popup.classList.remove("popup");
  });

  // To add basic auth, I'll use a simple cookie, set by the modal. If the cookie exists, the user can navigate
  // else, the user is redirected to the homepage.

  // Handle modal submit button
  modalFormBtn.onclick = (event) => {
    event.preventDefault();
    let formData = new FormData(modalForm);
    let password = formData.get("password");
    let buff = btoa(password); //btoa is deprecated, but couldnt find a reliable way to encode a string on client side. (cant use Buffer methods)

    document.cookie = `parentportal_password=${buff}`;
    closeModal();
    popup.innerHTML = "Logged in!";
    popup.style.backgroundColor = "white";
    popup.classList.add("popup");
  };

  // handle parent portal click
  parentPortalBtn.onclick = async () => {
    let headers = new Headers(); // create new header object and append with DOM data.

    headers.set(
      "Authorization",
      "Basic " + document.cookie // create basic auth header with encoded data...
    );

    const isCookieSet = await (
      await fetch(`/api/auth`, {
        method: "GET",
        headers: headers,
      })
    ).json();

    if (isCookieSet.status === 200) {
      popup.innerHTML = "Navigating...";
      popup.style.backgroundColor = "Aquamarine";
      popup.classList.add("popup");
      window.location.href = "/parentportal";
    }

    if (isCookieSet.status === 401) {
      popup.innerHTML = "Error: Not Authorized!";
      popup.style.backgroundColor = "lightcoral";
      popup.classList.add("popup");
      openModal();
    }
  };
}

// handle subscribe form submission
subscribeButton.onclick = async (event) => {
  event.preventDefault();
  subscribeButton.value = "loading...";
  let formData = new FormData(subscribeForm);
  let name = formData.get("name");
  let email = formData.get("email");
  const body = JSON.stringify({ name: name, email: email });

  const response = await (
    await fetch(`/api/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    })
  ).json();

  if (response.errors) {
    subscribeErrors.replaceChildren();
    response.errors.forEach((err) => {
      // loop through errors and append to error div --> this allows multiple errors to be displayed
      let err_paragraph = document.createElement("p");
      let err_content = document.createTextNode(err.msg);
      err_paragraph.appendChild(err_content);
      subscribeErrors.appendChild(err_paragraph);
    });
  }

  if (response.status === 200 && response.message) {
    subscribeErrors.replaceChildren();
    // popup subscribe text to let user know their action worked
    subscribeButton.value = "Subscribed!";
    popup.innerHTML = response.message;
    popup.style.backgroundColor = "Aquamarine";
    popup.classList.add("popup");
  } else {
    subscribeButton.value = "Subscribe";
  }
};

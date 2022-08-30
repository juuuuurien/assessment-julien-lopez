// I just noticed the JS test included creating the carousel. I didn't need js for it
// because my first reaction was to impliment one in CSS to avoid bugs etc.
//
// What I WOULD do if I used JS would be to get an array of all images and then
// align them next to eachother, somthing like
//
//                                Array.from(decoument.querySelectorAll("carousel-img"))m">
//                                images.forEach((image, index) => image.style.transform = `translateX(${index * img width}px)`)
//
//
// and then set a timer to translate the images every 5 seconds via
//
//                                setInterval((translate right however many px)=>, 5000))
//
// then, get the image that left the container (which is the head of the array) and translate it all the way to the left,
//
//                                 so like translateX(-img-width * imgages.length)) etc.
//

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

  // Handle modal submit button
  const checkPassword = async () => {
    let headers = new Headers(); // create new header object and append with DOM data.
    headers.set(
      "Authorization",
      "Basic " + document.cookie // create basic auth header with encoded data...
    );

    console.log(document.cookie);

    const isValid = await (
      await fetch(`/api/auth`, {
        method: "GET",
        headers: headers,
      })
    ).json();

    return isValid.status;
  };

  modalFormBtn.onclick = async (event) => {
    event.preventDefault();
    let formData = new FormData(modalForm);
    let password = formData.get("password");

    // here I'm passing in the password directly. In a real world app, this would be encrypted and stored in a database etc
    // but for the sake of the demo, I'm just passing it in directly.
    document.cookie = `parentportal_password=${password}`;

    const authStatus = await checkPassword();

    if (authStatus === 200) {
      popup.innerHTML = "Password accepted!";
      popup.style.backgroundColor = "Aquamarine";
      popup.classList.add("popup");
      closeModal();
    }

    if (authStatus === 401) {
      popup.innerHTML = "Error: Not Authorized!";
      popup.style.backgroundColor = "lightcoral";
      popup.classList.add("popup");
    }
  };

  // handle parent portal click
  parentPortalBtn.onclick = async () => {
    const authStatus = await checkPassword();
    if (authStatus === 200) {
      popup.innerHTML = "Navigating...";
      popup.style.backgroundColor = "Aquamarine";
      popup.classList.add("popup");
      window.location.href = "/parentportal";
    }

    if (authStatus === 401) {
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

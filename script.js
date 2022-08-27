import "./styles.css";
import "./carousel.css";

function handleParentPortal() {
  console.log("hello world");
}

let parentPortal = document.getElementById("parent_portal");
parentPortal.onclick = handleParentPortal;

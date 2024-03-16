console.log("profile page javascript!");

const saveImgs = [];

function main() {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 20) {
      document.querySelector("nav").style.boxShadow =
        ".5px .5px 10px 1px black";
    } else {
      document.querySelector("nav").style.boxShadow = "none";
    }
  });
}

main();
  
  



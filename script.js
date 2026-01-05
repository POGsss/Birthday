lucide.createIcons();

window.addEventListener("load", function () {
  setTimeout(loaded, 2500);

  function loaded() {
    var load = document.getElementById("loader");
    load.style.left = "-100%";
    load.style.borderRight = "100px solid #D1193E";
    load.style.visibility = "hidden";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.getElementById("playButton");
  const menu = document.getElementById("menuContainer");
  const bag = document.getElementById("bagContainer");
  const items = document.querySelectorAll(".items");
  const buttonIcons = document.querySelectorAll(".button-icon");
  const collectedItems = new Set();
  let activePocket = null;
  let activeContainer = null;

  const pockets = [
    document.getElementById("LeftPocket"),
    document.getElementById("RightPocket"),
    document.getElementById("MainPocket"),
    document.getElementById("FrontPocket"),
  ];

  const pocketToItem = {
    LeftPocket: "player",
    RightPocket: "scroll",
    FrontPocket: "camera",
    MainPocket: "flower",
  };

  const buttonItem = {
    flower: document.getElementById("buttonFlower"),
    camera: document.getElementById("buttonCamera"),
    scroll: document.getElementById("buttonScroll"),
    player: document.getElementById("buttonPlayer")
  };

  const containers = {
    flower: document.querySelector(".flower-container"),
    camera: document.querySelector(".camera-container"),
    scroll: document.querySelector(".scroll-container"),
    player: document.querySelector(".player-container")
  };

  playButton.addEventListener("click", () => {
    menu.classList.remove("show");
    bag.classList.add("show");
  });

  function checkAllCollected() {
    if (collectedItems.size === Object.keys(pocketToItem).length) {
      nextButton.classList.add("show");
    }
  }

  function hideItem(item) {
    item.classList.add("hide");

    setTimeout(() => {
      item.classList.remove("show");
      item.style.display = "none";
    }, 500);
  }

  function hideAllItems() {
    document.querySelectorAll(".items.show").forEach((item) => {
      hideItem(item);
    });
  }

  items.forEach((item) => {
    item.addEventListener("click", () => {
      collectedItems.add(item.id);

      hideItem(item);

      if (buttonItem[item.id]) {
        buttonItem[item.id].classList.add("show");
      }

      if (activePocket) {
        activePocket.classList.remove("open");
        activePocket = null;
      }

      checkAllCollected();
    });
  });

  buttonIcons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!collectedItems.has(button.id.replace("button", "").toLowerCase())) {
        return;
      }

      const containerKey = button.id.replace("button", "").toLowerCase();
      const container = containers[containerKey];

      if (activeContainer === container) {
        container.classList.remove("show");
        activeContainer = null;
        bag.classList.add("show");
        return;
      }

      if (activeContainer) {
        activeContainer.classList.remove("show");
      }

      bag.classList.remove("show");
      container.classList.add("show");
      activeContainer = container;
    });
  });

  pockets.forEach((pocket) => {
    pocket.addEventListener("click", () => {
      const itemId = pocketToItem[pocket.id];
      const item = document.getElementById(itemId);

      if (activePocket === pocket) {
        pocket.classList.remove("open");
        hideAllItems();
        activePocket = null;

        bag.classList.remove("pop");
        void bag.offsetWidth;
        bag.classList.add("pop");
        return;
      }

      if (activePocket) {
        activePocket.classList.remove("open");
      }
      hideAllItems();

      pocket.classList.add("open");
      activePocket = pocket;

      if (!collectedItems.has(itemId)) {
        item.classList.add("show");
      }

      bag.classList.remove("pop");
      void bag.offsetWidth;
      bag.classList.add("pop");
    });
  });
});

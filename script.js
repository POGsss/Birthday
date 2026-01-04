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
  const collectedItems = new Set();
  const nextButton = document.getElementById("nextButton");

  function checkAllCollected() {
    if (collectedItems.size === Object.keys(pocketToItem).length) {
      nextButton.classList.add("show");
    }
  }

  const pocketToItem = {
    LeftPocket: "player",
    RightPocket: "scroll",
    FrontPocket: "camera",
    MainPocket: "flower",
  };

  const items = document.querySelectorAll(".items");

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

      if (activePocket) {
        activePocket.classList.remove("open");
        activePocket = null;
      }

      checkAllCollected();
    });
  });

  const playButton = document.getElementById("playButton");

  playButton.addEventListener("click", () => {
    document.getElementById("menuContainer").classList.remove("show");
    document.getElementById("bagContainer").classList.add("show");
  });

  const bag = document.getElementById("bagContainer");

  const pockets = [
    document.getElementById("LeftPocket"),
    document.getElementById("RightPocket"),
    document.getElementById("MainPocket"),
    document.getElementById("FrontPocket"),
  ];

  let activePocket = null;

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

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
  const title = document.getElementById("titleContainer");
  const playButton = document.getElementById("playButton");
  const menu = document.getElementById("menuContainer");
  const bag = document.getElementById("bagContainer");
  const shutter = document.getElementById("Shutter");
  const scrollClose = document.getElementById("scrollClose");
  const scrollOpen = document.getElementById("scrollOpen");
  const items = document.querySelectorAll(".items");
  const buttonIcons = document.querySelectorAll(".button-icon");
  const leaves = document.querySelectorAll(".leaf");
  const photos = document.querySelectorAll(".photo");
  const transitionAudio = new Audio("assets/audio/transition.mp3");

  const collectedItems = new Set();
  let activePocket = null;
  let activeContainer = null;
  let activeButton = null;
  let lovesMe = false;
  let currentPhoto = 0;

  const audioFiles = [
    "assets/audio/1.mp3",
    "assets/audio/2.mp3",
    "assets/audio/3.mp3",
    "assets/audio/4.mp3",
    "assets/audio/5.mp3",
    "assets/audio/6.mp3",
  ];

  let currentTrack = 0;
  let isPlaying = false;
  const audio = new Audio();
  audio.src = audioFiles[currentTrack];
  audio.volume = 0.5;
  audio.loop = true;

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

  function checkAllCollected() {
    if (collectedItems.size === Object.keys(pocketToItem).length) {
      document.getElementById("titleText").innerHTML = "All items collected!";
    } else {
      document.getElementById("titleText").innerHTML = "Check all the bag's pockets!";
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

  function triggerPop(el) {
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");

    el.addEventListener(
      "animationend",
      () => {
        el.classList.remove("pop");
      },
      { once: true }
    );
  }

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      triggerPop(document.getElementById("Play"));
    } else {
      audio.play();
      isPlaying = true;
      triggerPop(document.getElementById("Play"));
    }
  }

  function nextTrack() {
    audio.pause();
    transitionAudio.currentTime = 0;
    transitionAudio.play();
    triggerPop(document.getElementById("Next"));

    transitionAudio.onended = () => {
      currentTrack++;
      if (currentTrack >= audioFiles.length) currentTrack = 0;
      audio.src = audioFiles[currentTrack];
      audio.play();
      isPlaying = true;
    };
  }

  function prevTrack() {
    audio.pause();
    transitionAudio.currentTime = 0;
    transitionAudio.play();
    triggerPop(document.getElementById("Prev"));

    transitionAudio.onended = () => {
      currentTrack--;
      if (currentTrack < 0) currentTrack = audioFiles.length - 1;
      audio.src = audioFiles[currentTrack];
      audio.play();
      isPlaying = true;
    };
  }

  function changeVolume(amount) {
    audio.volume = Math.min(Math.max(audio.volume + amount, 0), 1);
    triggerPop(document.getElementById(amount > 0 ? "VolUp" : "VolDown"));
  }

  document.getElementById("Play").addEventListener("click", togglePlay);
  document.getElementById("Next").addEventListener("click", nextTrack);
  document.getElementById("Prev").addEventListener("click", prevTrack);
  document.getElementById("VolUp").addEventListener("click", () => changeVolume(0.1));
  document.getElementById("VolDown").addEventListener("click", () => changeVolume(-0.1));

  playButton.addEventListener("click", () => {
    title.classList.add("show");
    menu.classList.remove("show");
    bag.classList.add("show");
  });

  shutter.addEventListener("click", () => {
    if (currentPhoto >= photos.length) return;

    const photo = photos[currentPhoto];
    photo.classList.add("show");

    setTimeout(() => {
      photo.style.display = "none";
    }, 7500);

    currentPhoto++;
  });

  scrollClose.addEventListener("click", () => {
    if (!scrollClose.classList.contains("show")) return;

    scrollClose.classList.remove("show");
    scrollOpen.classList.add("show");

    triggerPop(scrollOpen);
  });

  scrollOpen.addEventListener("click", () => {
    if (!scrollOpen.classList.contains("show")) return;

    scrollOpen.classList.remove("show");
    scrollClose.classList.add("show");

    triggerPop(scrollClose);
  });

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
      const containerKey = button.id.replace("button", "").toLowerCase();
      const container = containers[containerKey];

      if (!collectedItems.has(containerKey)) {
        return;
      }

      if (containerKey === "flower") {
        if (lovesMe) {
          document.getElementById("titleText").innerHTML = "He loves me";
        } else {
          document.getElementById("titleText").innerHTML = "He loves me not";
        }
      } else if (containerKey === "camera") {
        document.getElementById("titleText").innerHTML = "Please smile!";
      } else if (containerKey === "scroll") {
        document.getElementById("titleText").innerHTML = "A special message";
      } else if (containerKey === "player") {
        document.getElementById("titleText").innerHTML = "Listen to this!";
      }

      if (activeContainer === container) {
        container.classList.remove("show");
        activeContainer = null;
        bag.classList.add("show");
        button.classList.remove("active");
        checkAllCollected();
        return;
      }

      if (activeContainer) {
        activeContainer.classList.remove("show");
      }

      if (activeButton) {
        activeButton.classList.remove("active");
      }
      
      button.classList.add("active");
      activeButton = button;
      bag.classList.remove("show");
      container.classList.add("show");
      activeContainer = container;
    });
  });

  document.getElementById("Leaf").addEventListener("click", () => {
    lovesMe = true;
  });

  leaves.forEach((leaf) => {
    leaf.addEventListener("click", () => {
      if (document.getElementById("titleText").innerHTML === "He loves me not") {
        document.getElementById("titleText").innerHTML = "He loves me";
      } else {
        document.getElementById("titleText").innerHTML = "He loves me not";
      }

      leaf.classList.add("fall");
      setTimeout(() => {
        leaf.style.display = "none";
      }, 1000);
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

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("avatar-modal");
  const modalImg = document.getElementById("modal-img");
  const modalText = document.getElementById("modal-text");
  const closeBtn = document.querySelector(".close-btn");

  const avatarDetails = {
    a1: { title: "Avatar 1 - Nix", id: "a1" },
    a2: { title: "Avatar 2 - Sprite", id: "a2" },
    a3: { title: "Avatar 3 - Steampunk", id: "a3" },
    a4: { title: "Avatar 4 - Friend 1", id: "a4" },
    a5: { title: "Avatar 5 - Friend 2", id: "a5" },
    a6: { title: "Avatar 6 - Prismarine", id: "a6" },
    a7: { title: "Avatar 7 - Kiwi", id: "a7" },
    a8: { title: "Avatar 8 - Amethyst", id: "a8" },
    a9: { title: "Avatar 9 - Ice", id: "a9" },
    a10: { title: "Avatar 10 - SennaVr", id: "a10" },
    a11: { title: "Avatar 11 - Stradale", id: "a11" },
    a12: { title: "Avatar 12 - TheRollingStone", id: "a12" },
    a13: { title: "Avatar 13 - Goober 1", id: "a13" },
    a14: { title: "Avatar 14 - Goober 2", id: "a14" },
    a15: { title: "Avatar 15 - Amethyst V2", id: "a15" },
  };

  document.querySelectorAll(".portfolio-gallery img").forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      const id = img.dataset.id;
      const details = avatarDetails[id];

      if (details) {
        modal.classList.remove("hidden");
        modalImg.src = img.src;
        modalImg.alt = img.alt;

        modalText.innerHTML = `<strong>${details.title}</strong><br>${details.id}`;

        modal.focus();
      } else {
        alert("No details found for this avatar.");
      }
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
    }
  });
});

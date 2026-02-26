let lottieAnimation;

function loadLottie(path) {
  if (lottieAnimation) {
    lottieAnimation.destroy();
    lottieAnimation = null;
  }

  lottieAnimation = lottie.loadAnimation({
    container: document.getElementById("lottie-container"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: path,
  });
}

const searchInput = document.getElementById("searchInput");
const contentContainer = document.querySelector(".content-container");

// Function to fetch API from OMDB API
async function fetchMovies(query) {
  try {
    if (!query.trim()) {
      contentContainer.innerHTML = "";
      document.getElementById("no-results").classList.add("hidden");
      return;
    }
    contentContainer.classList.add("active");
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
    );

    const data = await res.json();
    // console.log(data);

    if (data.Response == "False") {
      contentContainer.innerHTML = "";
      document.getElementById("no-results").classList.remove("hidden");

      loadLottie("resources/empty.json");

      // Animate here for no results
      gsap.from(".no-results", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out",
      });

      return;
    } else {
      document.getElementById("no-results").classList.add("hidden");

      if (lottieAnimation) {
        lottieAnimation.stop();
      }
    }
    renderMovies(data.Search);
  } catch (error) {
    contentContainer.innerHTML = "";
    document.getElementById("no-results").classList.remove("hidden");

    loadLottie("resources/error.json");

    document.querySelector(".no-results h2").textContent =
      "Something Went Wrong";
    document.querySelector(".no-results p").textContent =
      "Please check your connection and try again.";

    // Animate here
    gsap.from(".no-results", {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: "power2.out",
    });

    console.log(error);
  }
}

function renderMovies(movies) {
  contentContainer.innerHTML = movies
    .map((movie) => createCard(movie))
    .join("");
}

function createCard(movie) {
  return `
    <div class="movie-card" >
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "fallback.jpg"}" 
      onerror="this.src='https://dummyimage.com/300x450/000/fff&text=No+Image'" />
      <div class="movie-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    </div>
  `;
}

searchInput.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    const moviename = searchInput.value;
    console.log("Searching for : ", moviename);

    const query = searchInput.value.trim();
    if (query != "") {
      contentContainer.classList.remove("active");
      fetchMovies(query);
    }
  }
});

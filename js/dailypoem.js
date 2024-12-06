const API_URL = "https://poetrydb.org/title";

async function fetchDailyPoem() {
    const poemContainer = document.getElementById("poemContainer");

    // Get the current UTC date as YYYY-MM-DD
    const currentDate = new Date().toISOString().split("T")[0];

    try {
        // Check if poems are cached
        let poems = JSON.parse(localStorage.getItem("poemsCache"));

        // If no cache, fetch poems from the API
        if (!poems) {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("Failed to fetch poems from the API");
            }

            poems = await response.json();

            // Validate fetched data
            if (!Array.isArray(poems) || poems.length === 0) {
                throw new Error("Invalid poems data from API");
            }

            // Cache poems in localStorage
            localStorage.setItem("poemsCache", JSON.stringify(poems));
        }

        // Generate a deterministic index based on the date
        const randomIndex = generateDailyIndex(currentDate, poems.length);

        // Fetch the poem details by title
        const poemTitle = poems[randomIndex].title;
        const poemResponse = await fetch(`https://poetrydb.org/title/${encodeURIComponent(poemTitle)}`);
        const poemDetails = await poemResponse.json();

        if (!poemDetails || poemDetails.length === 0) {
            throw new Error("Poem details not found");
        }

        // Render the poem
        renderPoem(poemDetails[0]);
    } catch (error) {
        console.error("Error fetching poem:", error);
        poemContainer.innerHTML = `
            <p class="text-red-600">Unable to fetch poem. Please try again later.</p>
        `;
    }
}

function generateDailyIndex(dateString, max) {
    // Simple hash function to turn the date into a consistent index
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = (hash << 5) - hash + dateString.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Convert the hash into a positive integer within range
    return Math.abs(hash % max);
}

function renderPoem(poem) {
    const poemContainer = document.getElementById("poemContainer");
    poemContainer.innerHTML = ""; // Clear previous content

    // Render the title
    if (poem.title) {
        const titleElement = document.createElement("h3");
        titleElement.classList.add("text-xl", "font-semibold", "mb-3", "text-gray-900");
        titleElement.textContent = poem.title;
        poemContainer.appendChild(titleElement);
    }

    // Render the lines of the poem
    if (poem.lines) {
        poem.lines.forEach((line) => {
            const lineElement = document.createElement("p");
            lineElement.classList.add("mb-1");
            lineElement.textContent = line;
            poemContainer.appendChild(lineElement);
        });
    }

    // Render the author
    if (poem.author) {
        const authorElement = document.createElement("p");
        authorElement.classList.add("mt-4", "text-gray-600", "italic", "text-right");
        authorElement.textContent = `- ${poem.author}`;
        poemContainer.appendChild(authorElement);
    }
}

// Fetch the daily poem when the page loads
document.addEventListener("DOMContentLoaded", fetchDailyPoem);
async function fetchDailyPoem() {
    const poemContainer = document.getElementById('poemContainer');
    
    try {
        // Fetch a random poem with more robust error handling
        const randomResponse = await fetch('https://poetrydb.org/random/1');
        const poems = await randomResponse.json();
        
        // More thorough validation
        if (!Array.isArray(poems) || poems.length === 0 || !poems[0].lines) {
            throw new Error('Invalid poem data');
        }
        
        const poem = poems[0];
        
        // Clear previous loading message
        poemContainer.innerHTML = '';
        
        // Create title if available
        if (poem.title) {
            const titleElement = document.createElement('h3');
            titleElement.classList.add('text-xl', 'font-semibold', 'mb-3', 'text-gray-900');
            titleElement.textContent = poem.title;
            poemContainer.appendChild(titleElement);
        }
        
        // Render poem lines
        poem.lines.forEach(line => {
            const lineElement = document.createElement('p');
            lineElement.classList.add('mb-1');
            lineElement.textContent = line;
            poemContainer.appendChild(lineElement);
        });
        
        // Add author information
        if (poem.author) {
            const authorElement = document.createElement('p');
            authorElement.classList.add('mt-4', 'text-gray-600', 'italic', 'text-right');
            // authorElement.textContent = `- ${poem.author}`;
            authorElement.innerHTML = `- ${poem.author} <br><br>
                <div class="text-center">This poem was randomly generated using 
                <a href="https://poetrydb.org/index.html" class="underline" target="_blank">poetrydb.org</a></div>`;
            poemContainer.appendChild(authorElement);
        }
    } catch (error) {
        console.error('Error fetching poem:', error);
        poemContainer.innerHTML = `
            <p class="text-red-600">Unable to fetch poem. Please try again later.</p>
        `;
    }
}

// Fetch poem when the page loads
document.addEventListener('DOMContentLoaded', fetchDailyPoem);
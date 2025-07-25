let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Creativity is intelligence having fun.", category: "Creativity" },
  { text: "Do or do not. There is no try.", category: "Inspiration" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const lastFilter = localStorage.getItem("selectedCategory");
  if (lastFilter) {
    categoryFilter.value = lastFilter;
    filterQuotes();
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  filteredQuotes.forEach(quote => {
    const p = document.createElement("p");
    p.textContent = `"${quote.text}" — ${quote.category}`;
    quoteDisplay.appendChild(p);
  });

  localStorage.setItem("selectedCategory", selectedCategory);
}

function createAddQuoteForm() {
  console.log("Add Quote Form created");
}

function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
}

function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");
  const newQuoteText = quoteTextInput.value.trim();
  const newQuoteCategory = quoteCategoryInput.value.trim();

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();
    pushQuotesToServer(); // push new quote to server
    quoteTextInput.value = "";
    quoteCategoryInput.value = "";
  }
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format");
      }
    } catch (e) {
      alert("Failed to parse JSON file");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// 🔁 Periodically fetch new quotes from "server"
function syncWithServer() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(serverData => {
      // Simulate quotes from server (first 5 items)
      const serverQuotes = serverData.slice(0, 5).map(post => ({
        text: post.title,
        category: "Server"
      }));

      let conflictDetected = false;

      // Compare and sync
      const localQuoteTexts = new Set(quotes.map(q => q.text));
      serverQuotes.forEach(serverQuote => {
        if (!localQuoteTexts.has(serverQuote.text)) {
          quotes.push(serverQuote);
          conflictDetected = true;
        }
      });

      if (conflictDetected) {
        saveQuotes();
        populateCategories();
        filterQuotes();
        showNotification("Server data synced. Conflicts resolved.");
      }
    })
    .catch(error => {
      console.error("Sync failed:", error);
    });
}

// 🆕 Push local quotes to the server (simulated)
async function pushQuotesToServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quotes)
    });

    if (!response.ok) {
      throw new Error("Failed to push quotes to server");
    }

    const result = await response.json();
    console.log("Quotes pushed to server:", result);
  } catch (error) {
    console.error("Error pushing quotes to server:", error);
  }
}

// 📥 Fetch quotes (helper)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
    const data = await response.json();

    const serverQuotes = data.map(item => ({
      text: item.title,
      category: "Server"
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
    return [];
  }
}

// 🔔 Notify users of sync/conflict
function showNotification(message) {
  const notice = document.getElementById("notification");
  notice.textContent = message;
  notice.style.display = "block";
  setTimeout(() => {
    notice.style.display = "none";
  }, 4000);
}

// ⏲️ Periodic sync
setInterval(syncWithServer, 15000);
setInterval(pushQuotesToServer, 20000); // 🆕 push to server every 20 seconds

// 🎯 Event Listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuote").addEventListener("click", addQuote);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

// 🚀 Init
populateCategories();
createAddQuoteForm();
syncWithServer(); // Initial sync on load

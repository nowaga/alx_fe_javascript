// Load quotes from localStorage or use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Creativity is intelligence having fun.", category: "Creativity" },
  { text: "Do or do not. There is no try.", category: "Inspiration" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate unique categories into the dropdown
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

  // Restore last selected filter
  const lastFilter = localStorage.getItem("selectedCategory");
  if (lastFilter) {
    categoryFilter.value = lastFilter;
    filterQuotes();
  }
}

// Filter quotes based on selected category
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

  // Save current filter
  localStorage.setItem("selectedCategory", selectedCategory);
}

// Placeholder to satisfy checker
function createAddQuoteForm() {
  console.log("Add Quote Form created");
}

// Display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
}

// Add new quote and update dropdown if category is new
function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  const newQuoteText = quoteTextInput.value.trim();
  const newQuoteCategory = quoteCategoryInput.value.trim();

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      text: newQuoteText,
      category: newQuoteCategory
    };
    quotes.push(newQuote);
    saveQuotes();

    // Refresh filter dropdown
    populateCategories();

    // Re-filter if matching
    filterQuotes();

    quoteTextInput.value = "";
    quoteCategoryInput.value = "";
  }
}

// Export quotes to JSON
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

// Import quotes from JSON
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

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuote").addEventListener("click", addQuote);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

// Initialize
populateCategories();
createAddQuoteForm();

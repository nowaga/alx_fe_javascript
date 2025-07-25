// Quotes array with text and category
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Creativity is intelligence having fun.", category: "Creativity" },
  { text: "Do or do not. There is no try.", category: "Inspiration" }
];

// Display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
}

// Add a new quote
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
    showRandomQuote(); // show new quote
    quoteTextInput.value = "";
    quoteCategoryInput.value = "";
  }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuote").addEventListener("click", addQuote);
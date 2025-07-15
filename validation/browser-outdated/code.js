import sum from "./module.js";

const heading = document.querySelector("h1");

// Change the text content
heading.textContent = "New Heading Text";

// Add a new element
const newParagraph = document.createElement("p");

newParagraph.textContent = `Sum (1 + 2) = ${sum(1, 2)}`;

heading.appendChild(newParagraph);

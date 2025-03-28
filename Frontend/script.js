document.getElementById("uploadForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let formData = new FormData();
    let fileInput = document.getElementById("pdfFile");
    formData.append("file", fileInput.files[0]);

    fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta:", data);
            let bookInfo = JSON.parse(data.message); // Convertir la respuesta en objeto JSON
            let resultContainer = document.getElementById("resultMessage");
            resultContainer.innerHTML = ""; // Limpiar resultados previos
            resultContainer.classList.add("result-container");

            if (bookInfo.items && bookInfo.items.length > 0) {
                window.bookResults = bookInfo.items;

                bookInfo.items.forEach((book, index) => {
                    let bookDiv = document.createElement("div");
                    bookDiv.classList.add("book-item");

                    // titulo
                    let title = document.createElement("h3");
                    title.classList.add("book-title");
                    title.textContent = book.volumeInfo.title;

                    // autor
                    let author = document.createElement("p");
                    author.classList.add("book-author");
                    author.innerHTML = `<strong>Autor(es):</strong> ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Desconocido'}`;

                    // descripcion
                    let description = document.createElement("p");
                    description.classList.add("book-description");
                    description.innerHTML = `<strong>Descripción:</strong> ${book.volumeInfo.description || 'No disponible'}`;

                    // imagen
                    let img = document.createElement("img");
                    img.classList.add("book-image");
                    if (book.volumeInfo.imageLinks) {
                        img.src = book.volumeInfo.imageLinks.smallThumbnail;
                        img.alt = `Portada de ${book.volumeInfo.title}`;
                    }

                    // botón
                    let button = document.createElement("button");
                    button.classList.add("select-btn");
                    button.textContent = "Seleccionar";
                    button.addEventListener("click", () => selectBook(index));

                    // Agregar elementos al div del libro
                    bookDiv.appendChild(img);
                    bookDiv.appendChild(title);
                    bookDiv.appendChild(author);
                    bookDiv.appendChild(description);
                    bookDiv.appendChild(button);

                    // Agregar el div al contenedor
                    resultContainer.appendChild(bookDiv);
                });
            } else {
                let noResultMessage = document.createElement("p");
                noResultMessage.textContent = "No se encontró información para este libro.";
                resultContainer.appendChild(noResultMessage);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Hubo un error al subir el archivo.");
        });
});

// Función para seleccionar un libro y ocultar los demás
function selectBook(index) {
    let selectedBook = window.bookResults[index];
    let resultContainer = document.getElementById("resultMessage");
    resultContainer.innerHTML = ""; // Limpiar resultados anteriores

    let bookDiv = document.createElement("div");
    bookDiv.classList.add("book-item"); // Clase para la estructura del libro seleccionado

    let title = document.createElement("h3");
    title.classList.add("book-title");
    title.textContent = selectedBook.volumeInfo.title;

    let author = document.createElement("p");
    author.classList.add("book-author");
    author.innerHTML = `<strong>Autor(es):</strong> ${selectedBook.volumeInfo.authors ? selectedBook.volumeInfo.authors.join(', ') : 'Desconocido'}`;

    let description = document.createElement("p");
    description.classList.add("book-description");
    description.innerHTML = `<strong>Descripción:</strong> ${selectedBook.volumeInfo.description || 'No disponible'}`;

    let img = document.createElement("img");
    img.classList.add("book-image");
    if (selectedBook.volumeInfo.imageLinks) {
        img.src = selectedBook.volumeInfo.imageLinks.smallThumbnail;
        img.alt = `Portada de ${selectedBook.volumeInfo.title}`;
    }

    let link = document.createElement("a");
    link.href = selectedBook.volumeInfo.previewLink;
    link.textContent = "Ver más detalles";
    link.target = "_blank";

    // Agregar elementos al contenedor del libro seleccionado
    bookDiv.appendChild(img);
    bookDiv.appendChild(title);
    bookDiv.appendChild(author);
    bookDiv.appendChild(description);
    bookDiv.appendChild(link);

    resultContainer.appendChild(bookDiv);
}

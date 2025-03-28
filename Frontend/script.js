document.getElementById("uploadForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let formData = new FormData();
    let fileInput = document.getElementById("pdfFile");
    let titleInput = document.getElementById("bookTitle");

    // Agregar el archivo PDF
    formData.append("file", fileInput.files[0]);

    // Agregar el título del libro (si lo proporciona el usuario)
    if (titleInput.value.trim() !== "") {
        formData.append("bookTitle", titleInput.value.trim());
    }

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

                    // Título
                    let title = document.createElement("h3");
                    title.classList.add("book-title");
                    title.textContent = book.volumeInfo.title;

                    // Autor
                    let author = document.createElement("p");
                    author.classList.add("book-author");
                    author.textContent = `Autor(es): ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Desconocido'}`;

                    // ISBN-13
                    let isbn = document.createElement("p");
                    isbn.classList.add("book-author");
                    let isbn13 = book.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier || 'No disponible';
                    isbn.textContent = `ISBN-13: ${isbn13}`;

                    // Páginas
                    let pages = document.createElement("p");
                    pages.classList.add("book-author");
                    pages.textContent = `Páginas: ${book.volumeInfo.pageCount || 'No disponible'}`;

                    // Editorial
                    let publisher = document.createElement("p");
                    publisher.classList.add("book-author");
                    publisher.textContent = `Editorial: ${book.volumeInfo.publisher || 'No disponible'}`;

                    // Imagen
                    let img = document.createElement("img");
                    img.classList.add("book-author");
                    if (book.volumeInfo.imageLinks) {
                        img.setAttribute("src", book.volumeInfo.imageLinks.smallThumbnail);
                        img.setAttribute("alt", `Portada de ${book.volumeInfo.title}`);
                    }

                    // Botón de selección
                    let button = document.createElement("button");
                    button.classList.add("select-btn");
                    button.textContent = "Seleccionar";
                    button.addEventListener("click", () => selectBook(index));

                    // Agregar elementos al div del libro
                    bookDiv.appendChild(img);
                    bookDiv.appendChild(title);
                    bookDiv.appendChild(author);
                    bookDiv.appendChild(isbn);
                    bookDiv.appendChild(pages);
                    bookDiv.appendChild(publisher);
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
    bookDiv.classList.add("book-item");
    // titulo
    let title = document.createElement("h3");
    title.classList.add("book-title");
    title.textContent = selectedBook.volumeInfo.title;
    // autor
    let author = document.createElement("p");
    author.classList.add("book-author");
    author.textContent = `Autor(es): ${selectedBook.volumeInfo.authors ? selectedBook.volumeInfo.authors.join(', ') : 'Desconocido'}`;
    // isbn
    let isbn = document.createElement("p");
    isbn.classList.add("book-author");
    let isbn13 = selectedBook.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier || 'No disponible';
    isbn.textContent = `ISBN-13: ${isbn13}`;
    // páginas
    let pages = document.createElement("p");
    pages.classList.add("book-author");
    pages.textContent = `Páginas: ${selectedBook.volumeInfo.pageCount || 'No disponible'}`;
    // editorial
    let publisher = document.createElement("p");
    publisher.classList.add("book-author");
    publisher.textContent = `Editorial: ${selectedBook.volumeInfo.publisher || 'No disponible'}`;
    // imagen
    let img = document.createElement("img");
    img.classList.add("book-image");
    if (selectedBook.volumeInfo.imageLinks) {
        img.setAttribute("src", selectedBook.volumeInfo.imageLinks.smallThumbnail);
        img.setAttribute("alt", `Portada de ${selectedBook.volumeInfo.title}`);
    }

    let link = document.createElement("a");
    link.setAttribute("href", selectedBook.volumeInfo.previewLink);
    link.textContent = "Ver más detalles";
    link.setAttribute("target", "_blank");

    // Agregar elementos al contenedor del libro seleccionado
    bookDiv.appendChild(img);
    bookDiv.appendChild(title);
    bookDiv.appendChild(author);
    bookDiv.appendChild(isbn);
    bookDiv.appendChild(pages);
    bookDiv.appendChild(publisher);
    bookDiv.appendChild(link);

    resultContainer.appendChild(bookDiv);
}

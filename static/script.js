document.getElementById("uploadForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let formData = new FormData();
    let fileInput = document.getElementById("pdfFile");
    let titleInput = document.getElementById("bookTitle");

    // Actualizar nombre del archivo mostrado
    if (fileInput.files[0]) {
        document.getElementById("file-name").textContent = fileInput.files[0].name;
    }

    // Agregar el archivo PDF
    formData.append("file", fileInput.files[0]);

    // Agregar el título del libro (si lo proporciona el usuario)
    if (titleInput.value.trim() !== "") {
        formData.append("bookTitle", titleInput.value.trim());
    }

    fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta:", data);
            let bookInfo = data.message;
            let resultContainer = document.getElementById("resultMessage");
            resultContainer.innerHTML = ""; // Limpiar resultados previos

            // Establecer vista de grid para múltiples resultados
            resultContainer.className = "results-container grid-view";

            if (bookInfo.items && bookInfo.items.length > 0) {
                window.bookResults = bookInfo.items;

                bookInfo.items.forEach((book, index) => {
                    let bookDiv = document.createElement("div");
                    bookDiv.classList.add("book-item");

                    // Imagen
                    let img = document.createElement("img");
                    img.classList.add("book-image");
                    if (book.volumeInfo.imageLinks) {
                        img.setAttribute("src", book.volumeInfo.imageLinks.thumbnail || book.volumeInfo.imageLinks.smallThumbnail);
                        img.setAttribute("alt", `Portada de ${book.volumeInfo.title}`);
                    } else {
                        // Imagen por defecto si no hay portada
                        img.setAttribute("src", "https://via.placeholder.com/150x200?text=No+Portada");
                    }

                    // Contenido del libro
                    let bookContent = document.createElement("div");
                    bookContent.classList.add("book-content");

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
                    isbn.classList.add("book-isbn");
                    let isbn13 = book.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier || 'No disponible';
                    isbn.textContent = `ISBN-13: ${isbn13}`;

                    // Páginas
                    let pages = document.createElement("p");
                    pages.classList.add("book-pages");
                    pages.textContent = `Páginas: ${book.volumeInfo.pageCount || 'No disponible'}`;

                    // Editorial
                    let publisher = document.createElement("p");
                    publisher.classList.add("book-publisher");
                    publisher.textContent = `Editorial: ${book.volumeInfo.publisher || 'No disponible'}`;

                    // Botón de selección
                    let button = document.createElement("button");
                    button.classList.add("select-btn");
                    button.textContent = "Seleccionar";
                    button.addEventListener("click", () => selectBook(index));

                    // Agregar elementos al contenido del libro
                    bookContent.appendChild(title);
                    bookContent.appendChild(author);
                    bookContent.appendChild(isbn);
                    bookContent.appendChild(pages);
                    bookContent.appendChild(publisher);
                    bookContent.appendChild(button);

                    // Agregar imagen y contenido al div del libro
                    bookDiv.appendChild(img);
                    bookDiv.appendChild(bookContent);

                    // Agregar el div al contenedor
                    resultContainer.appendChild(bookDiv);
                });
            } else {
                let noResultMessage = document.createElement("div");
                noResultMessage.classList.add("no-results");
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

    // Cambiar a vista individual
    resultContainer.className = "results-container single-view";

    let bookDiv = document.createElement("div");
    bookDiv.classList.add("book-item");

    // Imagen
    let img = document.createElement("img");
    img.classList.add("book-image");
    if (selectedBook.volumeInfo.imageLinks) {
        img.setAttribute("src", selectedBook.volumeInfo.imageLinks.thumbnail || selectedBook.volumeInfo.imageLinks.smallThumbnail);
        img.setAttribute("alt", `Portada de ${selectedBook.volumeInfo.title}`);
    } else {
        // Imagen por defecto si no hay portada
        img.setAttribute("src", "https://via.placeholder.com/300x400?text=No+Portada");
    }

    // Contenido del libro
    let bookContent = document.createElement("div");
    bookContent.classList.add("book-content");

    // Título
    let title = document.createElement("h3");
    title.classList.add("book-title");
    title.textContent = selectedBook.volumeInfo.title;

    // Autor
    let author = document.createElement("p");
    author.classList.add("book-author");
    author.textContent = `Autor(es): ${selectedBook.volumeInfo.authors ? selectedBook.volumeInfo.authors.join(', ') : 'Desconocido'}`;

    // ISBN-13
    let isbn = document.createElement("p");
    isbn.classList.add("book-isbn");
    let isbn13 = selectedBook.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier || 'No disponible';
    isbn.textContent = `ISBN-13: ${isbn13}`;

    // Páginas
    let pages = document.createElement("p");
    pages.classList.add("book-pages");
    pages.textContent = `Páginas: ${selectedBook.volumeInfo.pageCount || 'No disponible'}`;

    // Editorial
    let publisher = document.createElement("p");
    publisher.classList.add("book-publisher");
    publisher.textContent = `Editorial: ${selectedBook.volumeInfo.publisher || 'No disponible'}`;

    // Descripción
    let description = document.createElement("div");
    description.classList.add("book-description");
    description.textContent = selectedBook.volumeInfo.description || 'Descripción no disponible';

    // Agregar elementos al contenido del libro
    bookContent.appendChild(title);
    bookContent.appendChild(author);
    bookContent.appendChild(isbn);
    bookContent.appendChild(pages);
    bookContent.appendChild(publisher);
    bookContent.appendChild(description);

    // Agregar imagen y contenido al div del libro
    bookDiv.appendChild(img);
    bookDiv.appendChild(bookContent);

    resultContainer.appendChild(bookDiv);
}

// Mostrar nombre del archivo seleccionado
document.getElementById('pdfFile').addEventListener('change', function (e) {
    if (this.files[0]) {
        document.getElementById('file-name').textContent = this.files[0].name;
    }
});
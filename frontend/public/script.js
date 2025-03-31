document.getElementById("uploadForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    const fileInput = document.getElementById("pdfFile");
    const titleInput = document.getElementById("bookTitle");

    if (fileInput.files[0]) {
        document.getElementById("file-name").textContent = fileInput.files[0].name;
    }

    formData.append("file", fileInput.files[0]);

    if (titleInput.value.trim() !== "") {
        formData.append("bookTitle", titleInput.value.trim());
    }

    // Mostrar indicador de carga
    showLoading("Buscando libros en el documento...");

    try {
        const response = await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        // Mostrar mensaje si no hay resultados
        if (!result.message.items || result.message.items.length === 0) {
            showMessage("No se encontraron libros en el documento. Intenta con un título específico.");
            return;
        }

        displayBookResults(result.message);
    } catch (error) {
        showError(`Error: ${error.message}`);
    }
});

function displayBookResults(bookInfo) {
    const resultContainer = document.getElementById("resultMessage");
    // Limpiar el contenedor
    while (resultContainer.firstChild) {
        resultContainer.removeChild(resultContainer.firstChild);
    }

    if (bookInfo.items && bookInfo.items.length > 0) {
        window.bookResults = bookInfo.items;

        // Agregar encabezado con cantidad de libros encontrados
        const headerDiv = document.createElement("div");
        headerDiv.className = "results-header";

        const headerTitle = document.createElement("h2");
        const headerIcon = document.createElement("i");
        headerIcon.className = "fas fa-books";
        headerTitle.appendChild(headerIcon);
        headerTitle.appendChild(document.createTextNode(` Se encontraron ${bookInfo.items.length} libro(s)`));

        const headerText = document.createElement("p");
        headerText.textContent = "Haz clic en \"Ver detalles\" para más información sobre cada libro";

        headerDiv.appendChild(headerTitle);
        headerDiv.appendChild(headerText);
        resultContainer.appendChild(headerDiv);

        renderBooks(bookInfo.items, resultContainer);
    } else {
        renderNoResults("el documento", resultContainer);
    }
}

function renderBooks(books, container) {
    container.className = "results-container grid-view";
    window.bookResults = books;

    // Crear contenedor para los libros
    const booksGrid = document.createElement("div");
    booksGrid.className = "books-grid";
    container.appendChild(booksGrid);

    books.forEach((book, index) => {
        const bookDiv = document.createElement("div");
        bookDiv.className = "book-item";

        // Extraer datos del libro con manejo de posibles valores nulos
        const title = book.volumeInfo?.title || "Título desconocido";
        const authors = book.volumeInfo?.authors?.join(', ') || 'Autor desconocido';
        const publisher = book.volumeInfo?.publisher || 'Editorial desconocida';
        const thumbnail = book.volumeInfo?.imageLinks?.thumbnail;

        // Crear la imagen
        const bookImage = document.createElement("img");
        bookImage.src = thumbnail;
        bookImage.alt = `No se encontro foto de: '${title}'`;
        bookImage.className = "book-image";

        // Crear el contenedor del contenido
        const bookContent = document.createElement("div");
        bookContent.className = "book-content";

        // Crear título
        const bookTitle = document.createElement("h3");
        bookTitle.className = "book-title";
        bookTitle.textContent = title;

        // Crear metadatos
        const bookMeta = document.createElement("div");
        bookMeta.className = "book-meta";

        // Crear autor
        const bookAuthor = document.createElement("p");
        bookAuthor.className = "book-author";
        const authorIcon = document.createElement("i");
        authorIcon.className = "fas fa-user-edit";
        bookAuthor.appendChild(authorIcon);
        bookAuthor.appendChild(document.createTextNode(" " + authors));

        // Crear editorial
        const bookPublisher = document.createElement("p");
        bookPublisher.className = "book-publisher";
        const publisherIcon = document.createElement("i");
        publisherIcon.className = "fas fa-building";
        bookPublisher.appendChild(publisherIcon);
        bookPublisher.appendChild(document.createTextNode(" " + publisher));

        // Agregar metadatos
        bookMeta.appendChild(bookAuthor);
        bookMeta.appendChild(bookPublisher);

        // Crear botón
        const selectBtn = document.createElement("button");
        selectBtn.className = "select-btn";
        selectBtn.onclick = function () { selectBook(index); };
        const btnIcon = document.createElement("i");
        btnIcon.className = "fas fa-expand";
        selectBtn.appendChild(btnIcon);
        selectBtn.appendChild(document.createTextNode(" Ver detalles"));

        // Construir el elemento completo
        bookContent.appendChild(bookTitle);
        bookContent.appendChild(bookMeta);
        bookContent.appendChild(selectBtn);

        bookDiv.appendChild(bookImage);
        bookDiv.appendChild(bookContent);

        booksGrid.appendChild(bookDiv);
    });
}

function selectBook(index) {
    const selectedBook = window.bookResults[index];
    const resultContainer = document.getElementById("resultMessage");

    // Limpiar el contenedor
    while (resultContainer.firstChild) {
        resultContainer.removeChild(resultContainer.firstChild);
    }
    resultContainer.className = "results-container single-view";

    const bookDiv = document.createElement("div");
    bookDiv.className = "book-detail-card";

    // Extraer datos del libro
    const title = selectedBook.volumeInfo?.title || "Título desconocido";
    const authors = selectedBook.volumeInfo?.authors?.join(', ') || 'Autor desconocido';
    const publisher = selectedBook.volumeInfo?.publisher || 'Editorial desconocida';
    const thumbnail = selectedBook.volumeInfo?.imageLinks?.thumbnail || 'https://via.placeholder.com/300x400?text=No+Portada';
    const description = selectedBook.volumeInfo?.description || 'Descripción no disponible.';
    const pageCount = selectedBook.volumeInfo?.pageCount || '?';
    const publishedDate = selectedBook.volumeInfo?.publishedDate || 'Año desconocido';
    const language = selectedBook.volumeInfo?.language?.toUpperCase() || '?';
    const categories = selectedBook.volumeInfo?.categories?.join(', ') || 'No disponible';
    const previewLink = selectedBook.volumeInfo?.previewLink || null;

    // Crear encabezado
    const headerDiv = document.createElement("div");
    headerDiv.className = "book-detail-header";

    // Imagen del libro
    const img = document.createElement("img");
    img.src = thumbnail;
    img.alt = title;
    img.className = "book-detail-image";
    headerDiv.appendChild(img);

    // Información del encabezado
    const headerInfo = document.createElement("div");
    headerInfo.className = "book-header-info";

    // Título
    const titleElement = document.createElement("h2");
    titleElement.textContent = title;
    headerInfo.appendChild(titleElement);

    // Autores
    const authorsElement = document.createElement("p");
    authorsElement.className = "authors";
    authorsElement.textContent = authors;
    headerInfo.appendChild(authorsElement);

    // Estadísticas
    const statsDiv = document.createElement("div");
    statsDiv.className = "book-stats";

    const pagesStat = document.createElement("span");
    const pagesIcon = document.createElement("i");
    pagesIcon.className = "fas fa-book-open";
    pagesStat.appendChild(pagesIcon);
    pagesStat.appendChild(document.createTextNode(` ${pageCount} páginas`));
    statsDiv.appendChild(pagesStat);

    const dateStat = document.createElement("span");
    const dateIcon = document.createElement("i");
    dateIcon.className = "fas fa-calendar-alt";
    dateStat.appendChild(dateIcon);
    dateStat.appendChild(document.createTextNode(` ${publishedDate}`));
    statsDiv.appendChild(dateStat);

    const langStat = document.createElement("span");
    const langIcon = document.createElement("i");
    langIcon.className = "fas fa-language";
    langStat.appendChild(langIcon);
    langStat.appendChild(document.createTextNode(` ${language}`));
    statsDiv.appendChild(langStat);

    headerInfo.appendChild(statsDiv);

    // Detalles del libro (nueva sección)
    const detailInfoContainer = document.createElement("div");
    detailInfoContainer.className = "detail-info-container";

    const detailColumn = document.createElement("div");
    detailColumn.className = "detail-column";

    const detailTitle = document.createElement("h3");
    const detailIcon = document.createElement("i");
    detailIcon.className = "fas fa-info-circle";
    detailTitle.appendChild(detailIcon);
    detailTitle.appendChild(document.createTextNode(" Detalles"));
    detailColumn.appendChild(detailTitle);

    const publisherP = document.createElement("p");
    const publisherStrong = document.createElement("strong");
    publisherStrong.textContent = "Editorial:";
    publisherP.appendChild(publisherStrong);
    publisherP.appendChild(document.createTextNode(` ${publisher}`));
    detailColumn.appendChild(publisherP);

    const isbnP = document.createElement("p");
    const isbnStrong = document.createElement("strong");
    isbnStrong.textContent = "ISBN:";
    isbnP.appendChild(isbnStrong);
    isbnP.appendChild(document.createTextNode(` ${getISBN(selectedBook) || 'No disponible'}`));
    detailColumn.appendChild(isbnP);

    const categoriesP = document.createElement("p");
    const categoriesStrong = document.createElement("strong");
    categoriesStrong.textContent = "Categorías:";
    categoriesP.appendChild(categoriesStrong);
    categoriesP.appendChild(document.createTextNode(` ${categories}`));
    detailColumn.appendChild(categoriesP);

    detailInfoContainer.appendChild(detailColumn);
    headerInfo.appendChild(detailInfoContainer);

    headerDiv.appendChild(headerInfo);

    // Cuerpo del libro
    const bodyDiv = document.createElement("div");
    bodyDiv.className = "book-detail-body";

    // Descripción
    const descriptionDiv = document.createElement("div");
    descriptionDiv.className = "book-description";

    const descTitle = document.createElement("h3");
    const descIcon = document.createElement("i");
    descIcon.className = "fas fa-align-left";
    descTitle.appendChild(descIcon);
    descTitle.appendChild(document.createTextNode(" Descripción"));
    descriptionDiv.appendChild(descTitle);

    const descText = document.createElement("p");
    descText.textContent = description;
    descriptionDiv.appendChild(descText);

    bodyDiv.appendChild(descriptionDiv);

    // Acciones
    const actionColumn = document.createElement("div");
    actionColumn.className = "action-column";

    const backBtn = document.createElement("button");
    backBtn.className = "back-btn";
    backBtn.onclick = backToResults;
    const backIcon = document.createElement("i");
    backIcon.className = "fas fa-arrow-left";
    backBtn.appendChild(backIcon);
    backBtn.appendChild(document.createTextNode(" Volver a resultados"));
    actionColumn.appendChild(backBtn);

    if (previewLink) {
        const previewBtn = document.createElement("a");
        previewBtn.href = previewLink;
        previewBtn.target = "_blank";
        previewBtn.className = "preview-btn";
        const previewIcon = document.createElement("i");
        previewIcon.className = "fas fa-external-link-alt";
        previewBtn.appendChild(previewIcon);
        previewBtn.appendChild(document.createTextNode(" Vista previa"));
        actionColumn.appendChild(previewBtn);
    }

    bodyDiv.appendChild(actionColumn);

    // Ensamblar todo
    bookDiv.appendChild(headerDiv);
    bookDiv.appendChild(bodyDiv);

    resultContainer.appendChild(bookDiv);
}

function backToResults() {
    // Volver a mostrar todos los resultados
    if (window.bookResults) {
        displayBookResults({ items: window.bookResults });
    } else {
        window.location.reload();
    }
}

function getISBN(book) {
    const identifiers = book.volumeInfo?.industryIdentifiers;
    if (!identifiers) return null;
    const isbn13 = identifiers.find(id => id.type === "ISBN_13");
    const isbn10 = identifiers.find(id => id.type === "ISBN_10");
    return isbn13?.identifier || isbn10?.identifier;
}

function renderNoResults(query, container) {
    container.className = "results-container single-view";

    const messageDiv = document.createElement("div");
    messageDiv.className = "no-results-card";

    const icon = document.createElement("i");
    icon.className = "fas fa-search-minus";

    const title = document.createElement("h3");
    title.textContent = "No se encontraron resultados";

    const message = document.createElement("p");
    message.textContent = `No pudimos encontrar información para "${query}"`;

    const button = document.createElement("button");
    button.className = "back-btn";
    button.onclick = function () { window.location.reload(); };

    const buttonIcon = document.createElement("i");
    buttonIcon.className = "fas fa-redo";
    button.appendChild(buttonIcon);
    button.appendChild(document.createTextNode(" Intentar de nuevo"));

    messageDiv.appendChild(icon);
    messageDiv.appendChild(title);
    messageDiv.appendChild(message);
    messageDiv.appendChild(button);

    container.appendChild(messageDiv);
}

function showError(message) {
    const resultContainer = document.getElementById("resultMessage");
    resultContainer.className = "results-container single-view";

    // Limpiar el contenedor
    while (resultContainer.firstChild) {
        resultContainer.removeChild(resultContainer.firstChild);
    }

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-card";

    const icon = document.createElement("i");
    icon.className = "fas fa-exclamation-triangle";

    const title = document.createElement("h3");
    title.textContent = "Error";

    const errorMessage = document.createElement("p");
    errorMessage.textContent = message;

    const button = document.createElement("button");
    button.className = "back-btn";
    button.onclick = function () { window.location.reload(); };

    const buttonIcon = document.createElement("i");
    buttonIcon.className = "fas fa-redo";
    button.appendChild(buttonIcon);
    button.appendChild(document.createTextNode(" Reintentar"));

    errorDiv.appendChild(icon);
    errorDiv.appendChild(title);
    errorDiv.appendChild(errorMessage);
    errorDiv.appendChild(button);

    resultContainer.appendChild(errorDiv);
}

function showLoading(message) {
    const resultContainer = document.getElementById("resultMessage");
    resultContainer.className = "results-container single-view";

    // Limpiar el contenedor
    while (resultContainer.firstChild) {
        resultContainer.removeChild(resultContainer.firstChild);
    }

    const loadingDiv = document.createElement("div");
    loadingDiv.className = "loading-card";

    const spinner = document.createElement("div");
    spinner.className = "spinner";

    const loadingMessage = document.createElement("p");
    loadingMessage.textContent = message;

    loadingDiv.appendChild(spinner);
    loadingDiv.appendChild(loadingMessage);

    resultContainer.appendChild(loadingDiv);
}

// Mostrar nombre del archivo seleccionado
document.getElementById('pdfFile').addEventListener('change', function (e) {
    if (this.files[0]) {
        document.getElementById('file-name').textContent = this.files[0].name;
    }
});
# Proyecto de Extracción de Información de Libros desde PDF

Este proyecto es una aplicación web que permite a los usuarios subir archivos PDF y extraer información relevante sobre libros a partir de un título. Utiliza **FastAPI** en el backend y la **API de Google Books** para obtener detalles adicionales.

## 🚀 Características

- 📄 **Subida de PDF**: Los usuarios pueden cargar archivos PDF desde su dispositivo.
- 🔍 **Extracción de Títulos**: El sistema analiza el contenido del PDF y detecta posibles títulos de libros.
- 📚 **Búsqueda en Google Books**: Si se extrae un título válido, la aplicación consulta la API de Google Books para obtener detalles como autor, ISBN y número de páginas.
- 📝 **Búsqueda Manual**: De forma opcional se puede ingresar un título manualmente para buscarlo en Google Books.

## 🛠️ Tecnologías Utilizadas

- **FastAPI** - Backend y lógica del servidor.
- **pdfplumber** - Procesamiento y extracción de texto de archivos PDF.
- **Google Books API** - Consulta de información sobre libros.
- **HTML, CSS y JavaScript** - Para la interfaz de usuario.

## 📌 Instalación y Uso
1. Asegurarse de tener instalado python en el equipo
[Python (https://www.python.org/downloads/)]
3. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
```

3. **Dependencias**

Instalar dependencias:

```bash
pip install fastapi uvicorn python-multipart pdfplumber requests
```

Instalar dependencias desde `requirements.txt`:

```bash
pip install -r requirements.txt
```

4. **Usar la APP**

- Inicia el servidor backend de FastAPI. Para hacerlo, abre una terminal y ejecuta el siguiente comando en la raíz del proyecto:

```bash
uvicorn main:app --reload
```

Esto iniciará el servidor local en `http://localhost:8000`.

- Inicia una sesión local del `index.html` (puedes usar **Live Server** en Visual Studio Code para una experiencia más rápida).
- Sube un archivo PDF y opcionalmente ingresa un título de libro.
- URL de la API de prueba: Sustituye `NombreDelLibro` por el título del libro que quieras buscar:

```bash
https://www.googleapis.com/books/v1/volumes?q=NombreDelLibro
```

## 🎯 Objetivo

Este proyecto tiene como finalidad demostrar el uso de **procesamiento de archivos PDF**, **integración con APIs externas** y la creación de una **aplicación web funcional** enfocada en la extracción y consulta de información sobre libros.

---

✨ Desarrollado por [Jose Ayrton Rosell Bonavina](https://github.com/joss0102) ✨

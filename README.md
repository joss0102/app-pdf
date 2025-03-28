# Proyecto de Extracción de Información de Libros desde PDF

Este proyecto es una aplicación web que permite a los usuarios subir archivos PDF y extraer información relevante sobre libros. Utiliza **Java Spring** en el backend y la **API de Google Books** para obtener detalles adicionales.

## 🚀 Características

- 📄 **Subida de PDF**: Los usuarios pueden cargar archivos PDF desde su dispositivo.
- 🔍 **Extracción de Títulos**: El sistema analiza el contenido del PDF y detecta posibles títulos de libros.
- 📚 **Búsqueda en Google Books**: Si se extrae un título válido, la aplicación consulta la API de Google Books para obtener detalles como autor, ISBN y número de páginas.
- 📝 **Búsqueda Manual**: También se puede ingresar un título manualmente para buscarlo en Google Books.

## 🛠️ Tecnologías Utilizadas

- **Java Spring Boot** - Backend y lógica del servidor.
- **Apache PDFBox** - Procesamiento y extracción de texto de archivos PDF.
- **Google Books API** - Consulta de información sobre libros.
- **HTML, CSS y JavaScript** - Para la interfaz de usuario (si aplica).

## 📌 Instalación y Uso

1. **Clonar el repositorio**
```
git clone https://github.com/tu-usuario/tu-repositorio.git
```
2. **Ejecutar la aplicación**
- Asegúrate de tener **Java 17+** y **Maven** instalados.
- Dentro del directorio del proyecto, ejecuta:
  ```
  mvn spring-boot:run
  ```
3. **Usar la API**
- Inicia una sesion local del index.html
  - Rodumentariamente se puede usar liveServer en visual Studio Code
- Sube un archivo PDF y opcionalmente ingresa un título de libro.

## 🎯 Objetivo

Este proyecto tiene como finalidad demostrar el uso de **procesamiento de archivos PDF**, **integración con APIs externas** y la creación de una **aplicación web funcional** enfocada en la extracción y consulta de información sobre libros.

---

✨ Desarrollado por [Tu Nombre](https://github.com/tu-usuario) ✨

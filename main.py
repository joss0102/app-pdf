from fastapi import FastAPI, UploadFile, Form
from services.pdf_service import process_pdf
from config.cors import configure_cors  # Importamos la función de configuración de CORS

app = FastAPI()

# Configurar CORS utilizando la función externa
configure_cors(app)

@app.post("/upload/")
async def upload_file(file: UploadFile, bookTitle: str = Form(None)):
    result = await process_pdf(file, bookTitle)
    return {"message": result}

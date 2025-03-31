from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.pdf_service import process_pdf
from config.cors import configure_cors

app = FastAPI()
configure_cors(app)

@app.post("/upload/")
async def upload_file(
    file: UploadFile,
    bookTitle: str = Form(None)
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(400, "Solo se aceptan archivos PDF")
    
    try:
        result = await process_pdf(file, bookTitle)
        return {"message": result}
    except Exception as e:
        raise HTTPException(500, f"Error procesando documento: {str(e)}")
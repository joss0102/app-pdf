from fastapi.middleware.cors import CORSMiddleware

def configure_cors(app):
    # Configurar CORS para permitir peticiones desde el frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://127.0.0.1:5500"],  # Origen del frontend
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

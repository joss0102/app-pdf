import pdfplumber
import re
from typing import Optional
from services.google_books import search_book_in_google_books

async def process_pdf(file, book_title: Optional[str] = None):
    """Procesa PDF para extraer información de libros, incluso en facturas"""
    if book_title:
        return search_book_in_google_books(book_title)
        
    text = await extract_text_from_pdf(file)
    titles = await find_potential_book_titles(text)
    
    # Buscar todos los títulos potenciales y combinar resultados
    all_items = []
    found_titles = set()  # Para evitar duplicados
    
    for title in titles:
        book_data = search_book_in_google_books(title)
        if book_data.get('items'):
            # Para cada libro encontrado, verificamos que no esté duplicado
            for item in book_data.get('items', []):
                book_title = item.get('volumeInfo', {}).get('title', '')
                if book_title and book_title.lower() not in found_titles:
                    found_titles.add(book_title.lower())
                    all_items.append(item)
    
    # Construir un resultado combinado con todos los libros encontrados
    if all_items:
        return {"items": all_items}
    
    # Si no hay resultados después de intentar con todos los títulos
    return {"items": []}

async def extract_text_from_pdf(file):
    """Extrae texto de PDF con manejo de errores"""
    try:
        with pdfplumber.open(file.file) as pdf:
            return "\n".join(page.extract_text() or "" for page in pdf.pages)
    except Exception as e:
        raise ValueError(f"Error leyendo PDF: {str(e)}")

async def find_potential_book_titles(text: str) -> list:
    """Busca posibles títulos de libros en texto, especializado en facturas pero genérico para cualquier género"""
    # Dividir el texto en líneas para análisis por línea
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Identificar cabeceras de tabla (útil para facturas)
    header_indicators = ['descripción', 'producto', 'concepto', 'artículo', 'item', 'título', 'cantidad', 'importe', 'precio']
    header_pattern = re.compile('|'.join(header_indicators), re.IGNORECASE)
    
    # Identificar líneas que probablemente sean metadatos de la factura
    metadata_pattern = re.compile(r'factura|cliente|datos|calle|cp|email|teléfono|total|subtotal|iva|fecha|vencimiento|emisión|método|pago|observaciones', re.IGNORECASE)
    
    # Identificar líneas que son probablemente precios
    price_pattern = re.compile(r'^\s*\d+(?:[.,]\d{1,2})?\s*€?\s*$')
    
    potential_titles = []
    in_product_section = False
    
    # Primera pasada: Identificar secciones de productos en la factura
    for i, line in enumerate(lines):
        if header_pattern.search(line):
            in_product_section = True
            continue
        
        if in_product_section and not metadata_pattern.search(line.lower()):
            # Procesar línea como posible producto (título de libro)
            # Limpiar precios y cantidades al final de la línea
            cleaned_line = re.sub(r'\s+\d+(?:[.,]\d{1,2})?\s*€?\s*$', '', line)
            cleaned_line = re.sub(r'^\s*\d+\s*x\s*', '', cleaned_line)  # Quitar cantidades del inicio
            
            # Si después de limpiar aún queda texto sustancial
            if len(cleaned_line) >= 5 and len(cleaned_line) <= 150:
                potential_titles.append(cleaned_line.strip())
    
    # Segunda pasada: Si no encontramos nada en secciones de productos, buscar líneas que probablemente sean títulos
    if not potential_titles:
        for line in lines:
            # Evitar líneas que son claramente metadatos o precios
            if metadata_pattern.search(line.lower()) or price_pattern.match(line):
                continue
                
            # Considerar como título potencial si:
            # - Tiene una longitud razonable para ser un título
            # - No es solo números o caracteres especiales
            # - No está en mayúsculas completas (probablemente un encabezado)
            if (5 <= len(line) <= 150 and 
                not re.match(r'^[\d\W]+$', line) and 
                not line.isupper() and
                not re.match(r'^\s*\d+\s*$', line)):
                
                # Limpiar la línea de posibles precios al final
                cleaned_line = re.sub(r'\s+\d+(?:[.,]\d{1,2})?\s*€?\s*$', '', line)
                potential_titles.append(cleaned_line.strip())
    
    # Tercera estrategia: Buscar líneas que coincidan con patrones comunes de títulos
    title_patterns = [
        # Título seguido de precio o cantidad
        r'([A-Z][a-zá-úñ]+(?: [a-zá-úñ]+){1,10}(?: [A-Z][a-zá-úñ]+){0,3})\s+\d+(?:[.,]\d{1,2})?',
        
        # Formato típico de libro con artículos iniciales
        r'(?:[Ee]l|[Ll]a|[Ll]os|[Ll]as|[Uu]n|[Uu]na) [a-zá-úñ]+(?: [a-zá-úñ]+){1,10}',
        
        # Título seguido de autor o editorial
        r'([A-Z][a-zá-úñ]+(?: [a-zá-úñ]+){1,10})(?: - | por )([A-Z][a-zá-úñ]+(?: [a-zá-úñ]+){1,5})'
    ]
    
    for pattern in title_patterns:
        matches = re.findall(pattern, text)
        for match in matches:
            if isinstance(match, tuple):
                match = match[0]  # Tomar el primer grupo si es una tupla
            
            if 5 <= len(match) <= 150:
                potential_titles.append(match.strip())
    
    # Eliminar duplicados mientras preservamos el orden
    unique_titles = []
    seen = set()
    for title in potential_titles:
        title_lower = title.lower()
        if title_lower not in seen:
            seen.add(title_lower)
            unique_titles.append(title)
    
    # Filtrado final: eliminar títulos que parezcan ser información de la factura
    filtered_titles = [
        title for title in unique_titles 
        if not re.search(r'\b(factura|cliente|datos|calle|total|subtotal|iva)\b', title.lower())
    ]
    
    return filtered_titles  # Devolver todos los títulos potenciales (sin limitar a 5)
package pdf.extractor.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PdfService {

    private static final String GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

    public String processPdf(MultipartFile file) {
        try {
            String bookName = extractBookNameFromPdf(file);

            if (bookName.isEmpty()) {
                return "No se pudo encontrar un título en el PDF.";
            }

            return searchBookInGoogleBooks(bookName);
        } catch (IOException e) {
            e.printStackTrace();
            return "Error al procesar el PDF.";
        }
    }

    private String extractBookNameFromPdf(MultipartFile file) throws IOException {
        PDDocument document = PDDocument.load(file.getInputStream());
        PDFTextStripper stripper = new PDFTextStripper();

        String text = stripper.getText(document);
        document.close();

        // Normalizar el texto
        text = text.replaceAll("[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\\s]", ""); // Eliminar caracteres especiales
        text = text.replaceAll("\\s+", " ").trim(); // Eliminar espacios extra

        // Expresión regular para encontrar títulos en cualquier parte del PDF
        Pattern titlePattern = Pattern.compile("(?m)^(?:[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\\s+[A-ZÁÉÍÓÚÑa-záéíóúñ0-9]+){1,5})$");
        Matcher matcher = titlePattern.matcher(text);

        while (matcher.find()) {
            String possibleTitle = matcher.group().trim();
            if (possibleTitle.length() > 3 && possibleTitle.length() < 100) {
                return possibleTitle; // Devuelve el primer título que encuentre
            }
        }

        //  Si no encuentra un título, usa la línea más larga como posible título
        String[] lines = text.split("\\n");
        String longestLine = "";
        for (String line : lines) {
            if (line.length() > longestLine.length()) {
                longestLine = line.trim();
            }
        }

        return longestLine.isEmpty() ? "Título no encontrado" : longestLine;
    }

    private String searchBookInGoogleBooks(String bookName) {
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(GOOGLE_BOOKS_API_URL)
                .queryParam("q", bookName)
                .queryParam("maxResults", 5); // Limitar resultados

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(uriBuilder.toUriString(), String.class);

        return response.getBody();
    }
}

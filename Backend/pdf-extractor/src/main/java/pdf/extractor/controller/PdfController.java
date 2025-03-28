package pdf.extractor.controller;

import pdf.extractor.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/upload")
public class PdfController {

    private final PdfService pdfService;

    @Autowired
    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file,
            @RequestParam(value = "bookTitle", required = false) String bookTitle) {
        Map<String, String> response = new HashMap<>();

        if (file.isEmpty()) {
            response.put("message", "No se subió ningún archivo.");
            return ResponseEntity.badRequest().body(response);
        }

        String result = pdfService.processPdf(file, bookTitle);
        response.put("message", result);
        return ResponseEntity.ok(response);
    }
}

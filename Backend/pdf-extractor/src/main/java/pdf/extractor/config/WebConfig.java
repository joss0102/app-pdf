package pdf.extractor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica CORS a todas las rutas
                .allowedOrigins("http://127.0.0.1:5500") // Permitir el origen a front
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Permitir métodos HTTP
                .allowedHeaders("*"); // Permitir cualquier encabezado
    }
}

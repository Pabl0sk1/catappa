package com.practica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Map;

@SpringBootApplication
@RestController
public class AppSimpleApplication {

    @Value("${app.mensaje:Hola desde Docker}")
    private String mensaje;

    public static void main(String[] args) {
        SpringApplication.run(AppSimpleApplication.class, args);
    }

    @GetMapping("/")
    public Map<String, String> home() throws UnknownHostException {
        return Map.of(
                "mensaje", mensaje,
                "hostname", InetAddress.getLocalHost().getHostName(),
                "java", System.getProperty("java.version"),
                "usuario", System.getProperty("user.name")
        );
    }

    @GetMapping("/api/ping")
    public Map<String, String> ping() {
        return Map.of("respuesta", "pong");
    }
}

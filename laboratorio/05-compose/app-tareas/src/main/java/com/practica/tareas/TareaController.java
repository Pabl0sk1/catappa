package com.practica.tareas;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    private final TareaRepository repo;

    public TareaController(TareaRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Tarea> listar() {
        return repo.findAll();
    }

    @PostMapping
    public Tarea crear(@RequestBody Tarea tarea) {
        tarea.setId(null);
        return repo.save(tarea);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarea> completar(@PathVariable Long id) {
        return repo.findById(id)
                .map(t -> {
                    t.setCompletada(true);
                    return ResponseEntity.ok(repo.save(t));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/info")
    public Map<String, Object> info() throws UnknownHostException {
        return Map.of(
                "hostname", InetAddress.getLocalHost().getHostName(),
                "total", repo.count(),
                "db_url", System.getenv().getOrDefault("SPRING_DATASOURCE_URL", "(por defecto)")
        );
    }
}

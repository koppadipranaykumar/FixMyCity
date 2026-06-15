package com.fixmycity_api.worker;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "*")

public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(
            WorkerService workerService
    ) {
        this.workerService = workerService;
    }

    @GetMapping
    public List<Worker> getWorkers() {
        return workerService.getAllWorkers();
    }
    @GetMapping("/{id}")
    public Worker getWorkerById(
            @PathVariable Long id
    ) {
        return workerService.getWorkerById(id);
    }
    @PostMapping
    public Worker addWorker(
            @RequestBody Worker worker
    ) {
        return workerService.saveWorker(worker);
    }

    @DeleteMapping("/{id}")
    
    public void deleteWorker(
            @PathVariable Long id
    ) {
        workerService.deleteWorker(id);
    }
}

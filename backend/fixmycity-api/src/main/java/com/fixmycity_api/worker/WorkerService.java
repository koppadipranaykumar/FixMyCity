package com.fixmycity_api.worker;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public class WorkerService {

    private final WorkerRepository repository;

    public WorkerService(
            WorkerRepository repository
    ) {
        this.repository = repository;
    }
    public Worker getWorkerById(Long id) {
        return repository.findById(id).orElseThrow();
    }

    public List<Worker> getAllWorkers() {
        return repository.findAll();
    }

    public Worker saveWorker(
            Worker worker
    ) {
        return repository.save(worker);
    }

    public void deleteWorker(
            Long id
    ) {
        repository.deleteById(id);
    }
}
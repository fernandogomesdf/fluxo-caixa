package br.com.example.consolidacao_service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
// import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableJpaRepositories
@RestController
// @EnableKafka - Desabilitado temporariamente
public class ConsolidacaoServiceApplication {

	private static final Logger logger = LoggerFactory.getLogger(ConsolidacaoServiceApplication.class);

	@GetMapping("/")
	public String home() {
		logger.info("Home endpoint accessed");
		return "Consolidacao Service is running!";
	}

	@GetMapping("/health")
	public String health() {
		logger.info("Health endpoint accessed");
		return "OK";
	}

	@EventListener(ApplicationReadyEvent.class)
	public void applicationReady() {
		logger.info("##########################################");
		logger.info("APPLICATION IS READY AND RUNNING!");
		logger.info("Server should be accessible on port 8082");
		logger.info("##########################################");
	}

	public static void main(String[] args) {
		logger.info("Iniciando Consolidacao Service...");
		
		System.setProperty("spring.main.web-application-type", "servlet");
		
		SpringApplication.run(ConsolidacaoServiceApplication.class, args);
		logger.info("Consolidacao Service iniciado com sucesso!");
	}

}

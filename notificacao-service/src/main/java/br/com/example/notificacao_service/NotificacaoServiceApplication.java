package br.com.example.notificacao_service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
@RestController
public class NotificacaoServiceApplication {

	private static final Logger logger = LoggerFactory.getLogger(NotificacaoServiceApplication.class);

	@GetMapping("/")
	public String home() {
		logger.info("Home endpoint accessed");
		return "Notificacao Service is running!";
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
		logger.info("Server should be accessible on port 8083");
		logger.info("##########################################");
	}

	public static void main(String[] args) {
		logger.info("Iniciando Notificacao Service...");
		
		System.setProperty("spring.main.web-application-type", "servlet");
		
		SpringApplication.run(NotificacaoServiceApplication.class, args);
		logger.info("Notificacao Service iniciado com sucesso!");
	}

}

package br.com.example.consolidacao_service.controller;

import br.com.example.consolidacao_service.dto.ConsolidacaoRequest;
import br.com.example.consolidacao_service.dto.ConsolidacaoResponse;
import br.com.example.consolidacao_service.model.Consolidacao;
import br.com.example.consolidacao_service.service.ConsolidacaoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/consolidacao")
@CrossOrigin(origins = "*")
public class ConsolidacaoController {
    
    private static final Logger logger = LoggerFactory.getLogger(ConsolidacaoController.class);
    
    @Autowired
    private ConsolidacaoService consolidacaoService;
    
    /**
     * Endpoint para iniciar processo de consolidação
     */
    @PostMapping("/processar")
    public ResponseEntity<ConsolidacaoResponse> processarConsolidacao(@RequestBody ConsolidacaoRequest request) {
        logger.info("Recebida solicitação de consolidação: {}", request.getDataConsolidacao());
        
        try {
            ConsolidacaoResponse response = consolidacaoService.iniciarConsolidacao(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erro ao processar consolidação", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Endpoint para buscar a última consolidação
     */
    @GetMapping("/ultima")
    public ResponseEntity<Consolidacao> obterUltimaConsolidacao() {
        logger.info("Buscando última consolidação");
        
        Optional<Consolidacao> consolidacao = consolidacaoService.obterUltimaConsolidacao();
        
        if (consolidacao.isPresent()) {
            return ResponseEntity.ok(consolidacao.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Endpoint para listar histórico de consolidações
     */
    @GetMapping("/historico")
    public ResponseEntity<List<Consolidacao>> listarConsolidacoes() {
        logger.info("Listando histórico de consolidações");
        
        List<Consolidacao> consolidacoes = consolidacaoService.listarConsolidacoes();
        return ResponseEntity.ok(consolidacoes);
    }
    
    /**
     * Health check
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Consolidação Service is running");
    }
}

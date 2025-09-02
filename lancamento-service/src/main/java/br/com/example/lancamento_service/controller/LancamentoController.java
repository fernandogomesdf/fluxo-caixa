package br.com.example.lancamento_service.controller;

import br.com.example.lancamento_service.dto.LancamentoDTO;
import br.com.example.lancamento_service.dto.SimulacaoLancamentosDTO;
import br.com.example.lancamento_service.model.Lancamento;
import br.com.example.lancamento_service.model.TipoLancamento;
import br.com.example.lancamento_service.service.KafkaProducerService;
import br.com.example.lancamento_service.service.LancamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lancamentos")
@CrossOrigin(origins = "*")
public class LancamentoController {

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Autowired
    private LancamentoService lancamentoService;

    @PostMapping
    public ResponseEntity<Map<String, String>> criarLancamento(@Valid @RequestBody LancamentoDTO lancamentoDTO) {
        try {
            kafkaProducerService.enviarLancamento(lancamentoDTO);
            return ResponseEntity.ok(Map.of("message", "Lançamento enviado para processamento com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erro ao processar lançamento: " + e.getMessage()));
        }
    }

    @PostMapping("/simular")
    public ResponseEntity<Map<String, String>> simularLancamentos(@Valid @RequestBody SimulacaoLancamentosDTO simulacao) {
        try {
            if (simulacao.getValorMinimo().compareTo(simulacao.getValorMaximo()) > 0) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Valor mínimo não pode ser maior que o valor máximo"));
            }

            kafkaProducerService.simularLancamentos(simulacao);
            return ResponseEntity.ok(Map.of(
                "message", 
                String.format("Simulação iniciada: %d lançamentos de %s serão processados", 
                    simulacao.getQuantidade(), simulacao.getTipo().getDescricao())
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erro ao processar simulação: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Lancamento>> listarLancamentos(
            @RequestParam(required = false) TipoLancamento tipo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        
        List<Lancamento> lancamentos;

        if (tipo != null && inicio != null && fim != null) {
            lancamentos = lancamentoService.listarPorTipoEPeriodo(tipo, inicio, fim);
        } else if (inicio != null && fim != null) {
            lancamentos = lancamentoService.listarPorPeriodo(inicio, fim);
        } else if (tipo != null) {
            lancamentos = lancamentoService.listarPorTipo(tipo);
        } else {
            lancamentos = lancamentoService.listarTodos();
        }

        return ResponseEntity.ok(lancamentos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lancamento> buscarLancamento(@PathVariable Long id) {
        Lancamento lancamento = lancamentoService.buscarPorId(id);
        if (lancamento != null) {
            return ResponseEntity.ok(lancamento);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> excluirLancamento(@PathVariable Long id) {
        try {
            Lancamento lancamento = lancamentoService.buscarPorId(id);
            if (lancamento == null) {
                return ResponseEntity.notFound().build();
            }
            
            lancamentoService.excluir(id);
            return ResponseEntity.ok(Map.of("message", "Lançamento excluído com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erro ao excluir lançamento: " + e.getMessage()));
        }
    }

    @GetMapping("/tipos")
    public ResponseEntity<TipoLancamento[]> listarTipos() {
        return ResponseEntity.ok(TipoLancamento.values());
    }
}

package br.com.example.consolidacao_service.service;

import br.com.example.consolidacao_service.dto.ConsolidacaoRequest;
import br.com.example.consolidacao_service.dto.ConsolidacaoResponse;
import br.com.example.consolidacao_service.dto.LancamentoDto;
import br.com.example.consolidacao_service.model.Consolidacao;
import br.com.example.consolidacao_service.repository.ConsolidacaoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class ConsolidacaoService {
    
    private static final Logger logger = LoggerFactory.getLogger(ConsolidacaoService.class);
    
    @Autowired
    private ConsolidacaoRepository consolidacaoRepository;
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Autowired
    private RestTemplate restTemplate;
    
    private static final String LANCAMENTO_SERVICE_URL = "http://lancamento-service:8081/api/lancamentos";
    private static final String CONSOLIDACAO_TOPIC = "consolidacao-topic";
    
    /**
     * Inicia o processo de consolidação enviando mensagem para o Kafka
     */
    public ConsolidacaoResponse iniciarConsolidacao(ConsolidacaoRequest request) {
        logger.info("Iniciando processo de consolidação para data: {}", request.getDataConsolidacao());
        
        // Enviar mensagem para o Kafka para processamento assíncrono
        kafkaTemplate.send(CONSOLIDACAO_TOPIC, request);
        
        // Executar consolidação diretamente
        return processarConsolidacao(request);
    }
    
    /**
     * Processa a consolidação (consumidor Kafka) - Comentado temporariamente
     */
    // @KafkaListener(topics = CONSOLIDACAO_TOPIC, groupId = "consolidacao-group")
    public void processarConsolidacaoKafka(ConsolidacaoRequest request) {
        logger.info("Processando consolidação via Kafka para data: {}", request.getDataConsolidacao());
        processarConsolidacao(request);
    }
    
    /**
     * Executa a lógica de consolidação
     */
    public ConsolidacaoResponse processarConsolidacao(ConsolidacaoRequest request) {
        LocalDateTime inicioProcessamento = LocalDateTime.now();
        
        try {
            logger.info("Iniciando consolidação - Início: {}", inicioProcessamento);
            
            // 1. Buscar todos os lançamentos do serviço de lançamentos
            List<LancamentoDto> lancamentos = buscarLancamentos();
            
            // 2. Calcular saldo total
            double saldoTotal = calcularSaldoTotal(lancamentos);
            
            // 3. Finalizar processamento
            LocalDateTime fimProcessamento = LocalDateTime.now();
            long tempoProcessamento = java.time.Duration.between(inicioProcessamento, fimProcessamento).toMillis();
            
            // 4. Salvar consolidação no banco
            Consolidacao consolidacao = new Consolidacao(
                LocalDateTime.now(),
                saldoTotal,
                inicioProcessamento,
                fimProcessamento,
                tempoProcessamento,
                lancamentos.size()
            );
            
            consolidacao = consolidacaoRepository.save(consolidacao);
            
            logger.info("Consolidação concluída - ID: {}, Saldo Total: {}, Tempo: {}ms", 
                       consolidacao.getId(), saldoTotal, tempoProcessamento);
            
            return new ConsolidacaoResponse(
                consolidacao.getId(),
                consolidacao.getDataConsolidacao(),
                consolidacao.getSaldoTotal(),
                consolidacao.getInicioProcessamento(),
                consolidacao.getFimProcessamento(),
                consolidacao.getTempoProcessamento(),
                consolidacao.getQuantidadeLancamentos(),
                String.format("Consolidação realizada com sucesso! Processados %d lançamentos em %dms", 
                             lancamentos.size(), tempoProcessamento)
            );
            
        } catch (Exception e) {
            logger.error("Erro durante consolidação", e);
            throw new RuntimeException("Erro ao processar consolidação: " + e.getMessage());
        }
    }
    
    /**
     * Busca todos os lançamentos do microserviço de lançamentos
     */
    private List<LancamentoDto> buscarLancamentos() {
        try {
            ResponseEntity<List<LancamentoDto>> response = restTemplate.exchange(
                LANCAMENTO_SERVICE_URL,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<LancamentoDto>>() {}
            );
            
            return response.getBody();
        } catch (Exception e) {
            logger.error("Erro ao buscar lançamentos", e);
            throw new RuntimeException("Erro ao buscar lançamentos: " + e.getMessage());
        }
    }
    
    /**
     * Calcula o saldo total baseado nos lançamentos
     */
    private double calcularSaldoTotal(List<LancamentoDto> lancamentos) {
        return lancamentos.stream()
            .mapToDouble(lancamento -> {
                double valor = lancamento.getValor();
                return "DEBITO".equals(lancamento.getTipo()) ? -valor : valor;
            })
            .sum();
    }
    
    /**
     * Busca a última consolidação realizada
     */
    public Optional<Consolidacao> obterUltimaConsolidacao() {
        return consolidacaoRepository.findUltimaConsolidacao();
    }
    
    /**
     * Lista todas as consolidações (histórico)
     */
    public List<Consolidacao> listarConsolidacoes() {
        return consolidacaoRepository.findAll();
    }
    
    /**
     * Obtém consolidações agrupadas por data dos lançamentos
     */
    public List<Object> obterConsolidacoesPorDataLancamento() {
        try {
            // 1. Buscar todos os lançamentos
            List<LancamentoDto> lancamentos = buscarLancamentos();
            
            // 2. Agrupar por data (considerando apenas o dia, não hora/minuto)
            Map<String, List<LancamentoDto>> lancamentosPorData = lancamentos.stream()
                .collect(Collectors.groupingBy(this::extrairDataDoLancamento));
            
            // 3. Criar lista de consolidações por data
            List<Object> consolidacoesPorData = new ArrayList<>();
            
            for (Map.Entry<String, List<LancamentoDto>> entry : lancamentosPorData.entrySet()) {
                String data = entry.getKey();
                List<LancamentoDto> lancamentosData = entry.getValue();
                
                // Calcular saldo do dia
                double saldoDia = calcularSaldoTotal(lancamentosData);
                
                // Criar objeto de resposta
                Map<String, Object> consolidacaoDia = new HashMap<>();
                consolidacaoDia.put("dataLancamento", data);
                consolidacaoDia.put("saldoTotal", saldoDia);
                consolidacaoDia.put("quantidadeLancamentos", lancamentosData.size());
                consolidacaoDia.put("tempoProcessamento", 0L); // Não aplicável para agrupamento por data
                
                consolidacoesPorData.add(consolidacaoDia);
            }
            
            // 4. Ordenar por data (mais recente primeiro)
            consolidacoesPorData.sort((a, b) -> {
                @SuppressWarnings("unchecked")
                String dataA = (String) ((Map<String, Object>) a).get("dataLancamento");
                @SuppressWarnings("unchecked")
                String dataB = (String) ((Map<String, Object>) b).get("dataLancamento");
                return dataB.compareTo(dataA);
            });
            
            return consolidacoesPorData;
            
        } catch (Exception e) {
            logger.error("Erro ao agrupar consolidações por data", e);
            throw new RuntimeException("Erro ao processar consolidações por data: " + e.getMessage());
        }
    }
    
    /**
     * Extrai a data (apenas o dia) de um lançamento
     */
    private String extrairDataDoLancamento(LancamentoDto lancamento) {
        try {
            Object dataObj = lancamento.getDataLancamento();
            if (dataObj instanceof List) {
                List<?> dataArray = (List<?>) dataObj;
                if (dataArray.size() >= 3) {
                    int ano = ((Number) dataArray.get(0)).intValue();
                    int mes = ((Number) dataArray.get(1)).intValue();
                    int dia = ((Number) dataArray.get(2)).intValue();
                    
                    return String.format("%04d-%02d-%02d", ano, mes, dia);
                }
            }
            // Fallback para formato string ou data atual
            return LocalDateTime.now().toLocalDate().toString();
        } catch (Exception e) {
            logger.warn("Erro ao extrair data do lançamento, usando data atual", e);
            return LocalDateTime.now().toLocalDate().toString();
        }
    }
}

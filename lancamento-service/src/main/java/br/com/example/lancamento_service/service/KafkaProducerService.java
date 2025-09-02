package br.com.example.lancamento_service.service;

import br.com.example.lancamento_service.config.KafkaConfig;
import br.com.example.lancamento_service.dto.LancamentoDTO;
import br.com.example.lancamento_service.dto.SimulacaoLancamentosDTO;
import br.com.example.lancamento_service.model.Lancamento;
import br.com.example.lancamento_service.model.TipoLancamento;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Random;
import java.util.concurrent.CompletableFuture;

@Service
public class KafkaProducerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerService.class);

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private final Random random = new Random();

    public void enviarLancamento(LancamentoDTO lancamentoDTO) {
        try {
            // Se não foi informada a data, usa a data atual
            if (lancamentoDTO.getDataLancamento() == null) {
                lancamentoDTO.setDataLancamento(LocalDateTime.now());
            }

            String mensagem = objectMapper.writeValueAsString(lancamentoDTO);
            
            CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(KafkaConfig.LANCAMENTO_TOPIC, mensagem);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    logger.info("Lançamento enviado com sucesso: [{}] com offset=[{}]", 
                        mensagem, result.getRecordMetadata().offset());
                } else {
                    logger.error("Falha ao enviar lançamento: [{}] devido a: {}", mensagem, ex.getMessage());
                }
            });
            
        } catch (JsonProcessingException e) {
            logger.error("Erro ao serializar lançamento: {}", e.getMessage());
            throw new RuntimeException("Erro ao processar lançamento", e);
        }
    }

    public void simularLancamentos(SimulacaoLancamentosDTO simulacao) {
        YearMonth mesAtual = YearMonth.now();
        int diasNoMes = mesAtual.lengthOfMonth();

        for (int i = 0; i < simulacao.getQuantidade(); i++) {
            // Gerar valor aleatório entre min e max
            BigDecimal valor = gerarValorAleatorio(simulacao.getValorMinimo(), simulacao.getValorMaximo());
            
            // Gerar data aleatória no mês atual
            LocalDateTime dataAleatoria = gerarDataAleatoria(mesAtual.getYear(), mesAtual.getMonthValue(), diasNoMes);
            
            // Gerar descrição baseada no tipo
            String descricao = gerarDescricaoAleatoria(simulacao.getTipo(), i + 1);

            LancamentoDTO lancamento = new LancamentoDTO();
            lancamento.setDescricao(descricao);
            lancamento.setValor(valor);
            lancamento.setTipo(simulacao.getTipo());
            lancamento.setDataLancamento(dataAleatoria);

            enviarLancamento(lancamento);
            
            logger.info("Lançamento simulado {} de {}: {} - R$ {}", 
                i + 1, simulacao.getQuantidade(), descricao, valor);
        }
    }

    private BigDecimal gerarValorAleatorio(BigDecimal min, BigDecimal max) {
        BigDecimal range = max.subtract(min);
        BigDecimal randomValue = range.multiply(BigDecimal.valueOf(random.nextDouble()));
        return min.add(randomValue).setScale(2, RoundingMode.HALF_UP);
    }

    private LocalDateTime gerarDataAleatoria(int ano, int mes, int diasNoMes) {
        int dia = random.nextInt(diasNoMes) + 1;
        int hora = random.nextInt(24);
        int minuto = random.nextInt(60);
        int segundo = random.nextInt(60);
        
        return LocalDateTime.of(ano, mes, dia, hora, minuto, segundo);
    }

    private String gerarDescricaoAleatoria(TipoLancamento tipo, int numero) {
        String[] descricoesCredito = {
            "Venda de produto", "Recebimento de cliente", "Venda à vista", 
            "Transferência recebida", "Pagamento PIX recebido", "Venda no cartão"
        };
        
        String[] descricoesDebito = {
            "Pagamento de fornecedor", "Conta de luz", "Conta de água", 
            "Aluguel", "Compra de material", "Pagamento de funcionário"
        };

        String[] descricoes = tipo == TipoLancamento.CREDITO ? descricoesCredito : descricoesDebito;
        String baseDescricao = descricoes[random.nextInt(descricoes.length)];
        
        return baseDescricao + " #" + numero;
    }
}

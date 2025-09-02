package br.com.example.lancamento_service.service;

import br.com.example.lancamento_service.dto.LancamentoDTO;
import br.com.example.lancamento_service.model.Lancamento;
import br.com.example.lancamento_service.model.TipoLancamento;
import br.com.example.lancamento_service.repository.LancamentoRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LancamentoService {

    private static final Logger logger = LoggerFactory.getLogger(LancamentoService.class);

    @Autowired
    private LancamentoRepository lancamentoRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = "lancamento-topic", groupId = "lancamento-group")
    public void processarLancamento(@Payload String mensagem, 
                                  @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                  @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                  @Header(KafkaHeaders.OFFSET) long offset,
                                  Acknowledgment acknowledgment) {
        try {
            logger.info("Processando lançamento do tópico: {}, partição: {}, offset: {}", topic, partition, offset);
            
            // Deserializar a mensagem
            LancamentoDTO lancamentoDTO = objectMapper.readValue(mensagem, LancamentoDTO.class);
            
            // Converter DTO para entidade
            Lancamento lancamento = new Lancamento();
            lancamento.setDescricao(lancamentoDTO.getDescricao());
            lancamento.setValor(lancamentoDTO.getValor());
            lancamento.setTipo(lancamentoDTO.getTipo());
            lancamento.setDataLancamento(lancamentoDTO.getDataLancamento());
            
            // Salvar no banco
            Lancamento lancamentoSalvo = lancamentoRepository.save(lancamento);
            
            logger.info("Lançamento salvo com sucesso: ID={}, Descrição={}, Valor={}, Tipo={}", 
                lancamentoSalvo.getId(), 
                lancamentoSalvo.getDescricao(), 
                lancamentoSalvo.getValor(), 
                lancamentoSalvo.getTipo());
            
            // Acknowledge manual da mensagem
            acknowledgment.acknowledge();
            
        } catch (JsonProcessingException e) {
            logger.error("Erro ao deserializar mensagem: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Erro ao processar lançamento: {}", e.getMessage());
        }
    }

    public List<Lancamento> listarTodos() {
        return lancamentoRepository.findAll();
    }

    public List<Lancamento> listarPorTipo(TipoLancamento tipo) {
        return lancamentoRepository.findByTipo(tipo);
    }

    public List<Lancamento> listarPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return lancamentoRepository.findByPeriodo(inicio, fim);
    }

    public List<Lancamento> listarPorTipoEPeriodo(TipoLancamento tipo, LocalDateTime inicio, LocalDateTime fim) {
        return lancamentoRepository.findByTipoAndPeriodo(tipo, inicio, fim);
    }

    public Lancamento buscarPorId(Long id) {
        return lancamentoRepository.findById(id).orElse(null);
    }

    public void excluir(Long id) {
        lancamentoRepository.deleteById(id);
    }
}

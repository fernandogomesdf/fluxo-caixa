package br.com.example.consolidacao_service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consolidacao")
public class Consolidacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "data_consolidacao", nullable = false)
    private LocalDateTime dataConsolidacao;
    
    @Column(name = "saldo_total", nullable = false)
    private Double saldoTotal;
    
    @Column(name = "inicio_processamento", nullable = false)
    private LocalDateTime inicioProcessamento;
    
    @Column(name = "fim_processamento", nullable = false)
    private LocalDateTime fimProcessamento;
    
    @Column(name = "tempo_processamento", nullable = false)
    private Long tempoProcessamento; // em millisegundos
    
    @Column(name = "quantidade_lancamentos", nullable = false)
    private Integer quantidadeLancamentos;
    
    // Constructors
    public Consolidacao() {}
    
    public Consolidacao(LocalDateTime dataConsolidacao, Double saldoTotal, 
                       LocalDateTime inicioProcessamento, LocalDateTime fimProcessamento,
                       Long tempoProcessamento, Integer quantidadeLancamentos) {
        this.dataConsolidacao = dataConsolidacao;
        this.saldoTotal = saldoTotal;
        this.inicioProcessamento = inicioProcessamento;
        this.fimProcessamento = fimProcessamento;
        this.tempoProcessamento = tempoProcessamento;
        this.quantidadeLancamentos = quantidadeLancamentos;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public LocalDateTime getDataConsolidacao() {
        return dataConsolidacao;
    }
    
    public void setDataConsolidacao(LocalDateTime dataConsolidacao) {
        this.dataConsolidacao = dataConsolidacao;
    }
    
    public Double getSaldoTotal() {
        return saldoTotal;
    }
    
    public void setSaldoTotal(Double saldoTotal) {
        this.saldoTotal = saldoTotal;
    }
    
    public LocalDateTime getInicioProcessamento() {
        return inicioProcessamento;
    }
    
    public void setInicioProcessamento(LocalDateTime inicioProcessamento) {
        this.inicioProcessamento = inicioProcessamento;
    }
    
    public LocalDateTime getFimProcessamento() {
        return fimProcessamento;
    }
    
    public void setFimProcessamento(LocalDateTime fimProcessamento) {
        this.fimProcessamento = fimProcessamento;
    }
    
    public Long getTempoProcessamento() {
        return tempoProcessamento;
    }
    
    public void setTempoProcessamento(Long tempoProcessamento) {
        this.tempoProcessamento = tempoProcessamento;
    }
    
    public Integer getQuantidadeLancamentos() {
        return quantidadeLancamentos;
    }
    
    public void setQuantidadeLancamentos(Integer quantidadeLancamentos) {
        this.quantidadeLancamentos = quantidadeLancamentos;
    }
}

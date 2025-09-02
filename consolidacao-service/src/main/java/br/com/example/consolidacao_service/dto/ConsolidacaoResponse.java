package br.com.example.consolidacao_service.dto;

import java.time.LocalDateTime;

public class ConsolidacaoResponse {
    private Long id;
    private LocalDateTime dataConsolidacao;
    private Double saldoTotal;
    private LocalDateTime inicioProcessamento;
    private LocalDateTime fimProcessamento;
    private Long tempoProcessamento;
    private Integer quantidadeLancamentos;
    private String message;
    
    public ConsolidacaoResponse() {}
    
    public ConsolidacaoResponse(Long id, LocalDateTime dataConsolidacao, Double saldoTotal,
                               LocalDateTime inicioProcessamento, LocalDateTime fimProcessamento,
                               Long tempoProcessamento, Integer quantidadeLancamentos, String message) {
        this.id = id;
        this.dataConsolidacao = dataConsolidacao;
        this.saldoTotal = saldoTotal;
        this.inicioProcessamento = inicioProcessamento;
        this.fimProcessamento = fimProcessamento;
        this.tempoProcessamento = tempoProcessamento;
        this.quantidadeLancamentos = quantidadeLancamentos;
        this.message = message;
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
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}

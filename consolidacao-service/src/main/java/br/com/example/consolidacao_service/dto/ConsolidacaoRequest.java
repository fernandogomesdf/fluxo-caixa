package br.com.example.consolidacao_service.dto;

public class ConsolidacaoRequest {
    private String dataConsolidacao;
    
    public ConsolidacaoRequest() {}
    
    public ConsolidacaoRequest(String dataConsolidacao) {
        this.dataConsolidacao = dataConsolidacao;
    }
    
    public String getDataConsolidacao() {
        return dataConsolidacao;
    }
    
    public void setDataConsolidacao(String dataConsolidacao) {
        this.dataConsolidacao = dataConsolidacao;
    }
}

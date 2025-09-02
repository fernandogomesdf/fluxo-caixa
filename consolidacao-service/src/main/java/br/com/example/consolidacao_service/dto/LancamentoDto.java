package br.com.example.consolidacao_service.dto;

public class LancamentoDto {
    private Long id;
    private String descricao;
    private Double valor;
    private String tipo;
    private Object dataLancamento; // LocalDateTime como array do Java
    
    public LancamentoDto() {}
    
    public LancamentoDto(Long id, String descricao, Double valor, String tipo, Object dataLancamento) {
        this.id = id;
        this.descricao = descricao;
        this.valor = valor;
        this.tipo = tipo;
        this.dataLancamento = dataLancamento;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    
    public Double getValor() {
        return valor;
    }
    
    public void setValor(Double valor) {
        this.valor = valor;
    }
    
    public String getTipo() {
        return tipo;
    }
    
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    
    public Object getDataLancamento() {
        return dataLancamento;
    }
    
    public void setDataLancamento(Object dataLancamento) {
        this.dataLancamento = dataLancamento;
    }
}

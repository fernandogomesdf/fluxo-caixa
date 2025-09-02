package br.com.example.lancamento_service.dto;

import br.com.example.lancamento_service.model.TipoLancamento;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class SimulacaoLancamentosDTO {

    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 1, message = "Quantidade deve ser maior que zero")
    private Integer quantidade;

    @NotNull(message = "Valor mínimo é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor mínimo deve ser maior que zero")
    private BigDecimal valorMinimo;

    @NotNull(message = "Valor máximo é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor máximo deve ser maior que zero")
    private BigDecimal valorMaximo;

    @NotNull(message = "Tipo é obrigatório")
    private TipoLancamento tipo;

    // Constructors
    public SimulacaoLancamentosDTO() {}

    public SimulacaoLancamentosDTO(Integer quantidade, BigDecimal valorMinimo, BigDecimal valorMaximo, TipoLancamento tipo) {
        this.quantidade = quantidade;
        this.valorMinimo = valorMinimo;
        this.valorMaximo = valorMaximo;
        this.tipo = tipo;
    }

    // Getters and Setters
    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public BigDecimal getValorMinimo() {
        return valorMinimo;
    }

    public void setValorMinimo(BigDecimal valorMinimo) {
        this.valorMinimo = valorMinimo;
    }

    public BigDecimal getValorMaximo() {
        return valorMaximo;
    }

    public void setValorMaximo(BigDecimal valorMaximo) {
        this.valorMaximo = valorMaximo;
    }

    public TipoLancamento getTipo() {
        return tipo;
    }

    public void setTipo(TipoLancamento tipo) {
        this.tipo = tipo;
    }
}

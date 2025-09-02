package br.com.example.lancamento_service.model;

public enum TipoLancamento {
    CREDITO("Crédito"),
    DEBITO("Débito");

    private final String descricao;

    TipoLancamento(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}

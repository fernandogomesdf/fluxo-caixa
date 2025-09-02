package br.com.example.consolidacao_service.repository;

import br.com.example.consolidacao_service.model.Consolidacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConsolidacaoRepository extends JpaRepository<Consolidacao, Long> {
    
    @Query("SELECT c FROM Consolidacao c ORDER BY c.dataConsolidacao DESC LIMIT 1")
    Optional<Consolidacao> findUltimaConsolidacao();
    
}

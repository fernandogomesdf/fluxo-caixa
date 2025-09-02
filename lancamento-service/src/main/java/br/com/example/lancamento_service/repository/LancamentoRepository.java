package br.com.example.lancamento_service.repository;

import br.com.example.lancamento_service.model.Lancamento;
import br.com.example.lancamento_service.model.TipoLancamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LancamentoRepository extends JpaRepository<Lancamento, Long> {

    List<Lancamento> findByTipo(TipoLancamento tipo);

    List<Lancamento> findByDataLancamentoBetween(LocalDateTime inicio, LocalDateTime fim);

    @Query("SELECT l FROM Lancamento l WHERE l.dataLancamento BETWEEN :inicio AND :fim ORDER BY l.dataLancamento DESC")
    List<Lancamento> findByPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("SELECT l FROM Lancamento l WHERE l.tipo = :tipo AND l.dataLancamento BETWEEN :inicio AND :fim")
    List<Lancamento> findByTipoAndPeriodo(@Param("tipo") TipoLancamento tipo, 
                                         @Param("inicio") LocalDateTime inicio, 
                                         @Param("fim") LocalDateTime fim);
}

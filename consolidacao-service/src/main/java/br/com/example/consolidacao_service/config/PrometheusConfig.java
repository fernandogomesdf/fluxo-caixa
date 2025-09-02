package br.com.example.consolidacao_service.config;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.prometheus.PrometheusConfig;
import io.micrometer.prometheus.PrometheusMeterRegistry;
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.boot.actuate.endpoint.web.annotation.WebEndpoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class PrometheusConfig {
    
    @Bean
    @Primary
    public PrometheusMeterRegistry prometheusMeterRegistry() {
        return new PrometheusMeterRegistry(PrometheusConfig.DEFAULT);
    }
    
    @Endpoint(id = "prometheus")
    @WebEndpoint
    public static class PrometheusEndpoint {
        
        private final PrometheusMeterRegistry prometheusMeterRegistry;
        
        public PrometheusEndpoint(PrometheusMeterRegistry prometheusMeterRegistry) {
            this.prometheusMeterRegistry = prometheusMeterRegistry;
        }
        
        @ReadOperation(produces = "text/plain")
        public String prometheus() {
            return prometheusMeterRegistry.scrape();
        }
    }
    
    @Bean
    public PrometheusEndpoint prometheusEndpoint(PrometheusMeterRegistry prometheusMeterRegistry) {
        return new PrometheusEndpoint(prometheusMeterRegistry);
    }
}

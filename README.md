# Fluxo Caixa - Sistema de Microsserviços

Sistema de controle de fluxo de caixa baseado em arquitetura de microsserviços com monitoramento e mensageria.

## Documentação Técnica

**DAS (Documento de Arquitetura de Software):** [DAS_Fluxo_Caixa.docx](./DAS_Fluxo_Caixa.docx)

O DAS contém a documentação completa da arquitetura do sistema, incluindo diagramas, especificações técnicas e decisões de design.

## Arquitetura

### Microsserviços (Containerizados)
- **Lançamento Service** (Porta 8081): Gerencia lançamentos financeiros
- **Consolidação Service** (Porta 8082): Consolida dados financeiros
- **Notificação Service** (Porta 8083): Envia notificações

### Frontend (Containerizado)
- **Angular App** (Porta 4200): Interface de usuário com Nginx

### Infraestrutura (Containerizada)
- **Kafka** (Porta 9092): Mensageria entre serviços
- **Kafka UI** (Porta 8080): Interface para monitoramento do Kafka
- **Redis** (Porta 6379): Cache distribuído
- **Prometheus** (Porta 9090): Coleta de métricas
- **Grafana** (Porta 3000): Dashboards e visualização
- **H2 Database**: Banco de dados em memória para cada serviço

### Rede Docker
Todos os serviços estão na rede `fluxo-caixa-network` para comunicação interna.

## Como usar

### Pré-requisitos
- Docker e Docker Compose instalados

### Iniciando a aplicação
```bash
# Ir para a pasta do projeto
cd d:\desenvolvimento\fluxo-caixa

# Executar a aplicação completa
scripts\start-all.bat
```

### Parando a aplicação
```bash
scripts\stop-all.bat
```

### Comandos úteis para desenvolvimento
```bash
# Reconstruir um serviço específico
scripts\rebuild.bat frontend

# Reconstruir todos os serviços
scripts\rebuild.bat all

# Ver logs de um serviço
scripts\logs.bat lancamento-service

# Ver logs em tempo real
scripts\logs.bat consolidacao-service -f

# Ver logs de todos os serviços
scripts\logs.bat all
```

## URLs de Acesso

- **Frontend**: http://localhost:4200
- **Kafka UI**: http://localhost:8080
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Lançamento Service**: http://localhost:8081
- **Consolidação Service**: http://localhost:8082
- **Notificação Service**: http://localhost:8083

## Configurações

### Proxy Angular
O frontend está configurado para fazer proxy das chamadas `/api/*` para os respectivos microsserviços.

### Monitoramento
- Prometheus coleta métricas de todos os serviços via `/actuator/prometheus`
- Grafana exibe dashboards pré-configurados com métricas dos serviços e Kafka
- Dashboard principal: "Fluxo Caixa Monitoring"

### Cache
Redis configurado na porta 6379 para implementação de cache aside.

### Mensageria
Kafka configurado com Zookeeper para comunicação assíncrona entre serviços.

## Desenvolvimento

### Estrutura do Projeto
```
fluxo-caixa/
├── frontend/                 # Angular Frontend (Containerizado)
├── lancamento-service/       # Microsserviço de Lançamentos (Containerizado)
├── consolidacao-service/     # Microsserviço de Consolidação (Containerizado)
├── notificacao-service/      # Microsserviço de Notificações (Containerizado)
├── prometheus/               # Configurações do Prometheus
├── grafana/                  # Configurações e dashboards do Grafana
├── scripts/                  # Scripts de automação Docker
├── docker-compose.yml        # Orquestração completa
└── README.md                 # Este arquivo
```

### Scripts disponíveis
- **`start-all.bat`** - Inicia toda a aplicação
- **`stop-all.bat`** - Para toda a aplicação
- **`rebuild.bat`** - Reconstrói serviços específicos
- **`logs.bat`** - Visualiza logs dos serviços

### Dependências necessárias nos serviços Spring Boot
Adicionar no `pom.xml` de cada serviço:
- spring-boot-starter-actuator
- micrometer-registry-prometheus
- spring-kafka
- spring-boot-starter-data-redis
- h2

### Configurações dos serviços
Cada serviço deve expor métricas em `/actuator/prometheus` e configurar:
- Porta específica (8081, 8082, 8083)
- Conexão com Kafka
- Conexão com Redis
- Banco H2 em memória

## Comandos Docker Úteis

```bash
# Ver logs de um serviço específico
docker-compose logs lancamento-service

# Ver logs em tempo real
docker-compose logs -f consolidacao-service

# Reconstruir apenas um serviço
docker-compose up --build lancamento-service

# Verificar status dos serviços
docker-compose ps

# Parar apenas um serviço
docker-compose stop frontend

# Remover volumes (reset completo)
docker-compose down -v
```

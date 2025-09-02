# Use Eclipse Temurin JDK 21 as base image
FROM eclipse-temurin:21-jdk-alpine

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn
COPY pom.xml .

# Copy source code
COPY src src

# Make Maven wrapper executable
RUN chmod +x ./mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8082

# Run the application with JVM debug and keep alive options
CMD ["java", "-jar", "-Djava.awt.headless=true", "-Dspring.main.keep-alive=true", "target/consolidacao-service-0.0.1-SNAPSHOT.jar"]

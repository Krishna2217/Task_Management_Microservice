FROM eclipse-temurin:25-jdk AS build
WORKDIR /app
COPY api-gateway/mvnw .
COPY api-gateway/.mvn .mvn
COPY api-gateway/pom.xml .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B
COPY api-gateway/src src
# .git is needed so git-commit-id-maven-plugin can embed the real commit SHA into
# git.properties; the build context is the repo root specifically for this reason
COPY .git .git
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:25-jre
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/target/*.jar /app/app.jar
EXPOSE 8000
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 \
  CMD curl -f http://localhost:8000/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

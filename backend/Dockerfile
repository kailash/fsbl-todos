FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /usr/lib
COPY --from=build /app/target/Todo-0.0.1-SNAPSHOT.jar /usr/lib/Todo-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java", "-jar", "Todo-0.0.1-SNAPSHOT.jar"]

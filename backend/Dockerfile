FROM maven:3.6.3-openjdk-11-slim AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM adoptopenjdk/openjdk11:alpine-jre
WORKDIR /usr/lib
COPY --from=build /app/target/Todo-0.0.1-SNAPSHOT.jar /usr/lib/Todo-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java", "-jar", "Todo-0.0.1-SNAPSHOT.jar"]

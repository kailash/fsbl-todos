From adoptopenjdk/openjdk11:alpine-jre
WORKDIR usr/lib
ENV MONGO_DATABASENAME=todoapp
ENV MONGO_URL=mongodb://localhost:27017/todoapp
ADD ./target/Todo-0.0.1-SNAPSHOT.jar /usr/lib/Todo-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","Todo-0.0.1-SNAPSHOT.jar"]
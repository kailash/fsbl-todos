# Spring Boot 4 Migration — Reference

Source: [Official Spring Boot 4.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide) (Spring team, canonical).

## Contents
- System requirements
- Module dependencies (starters & modules)
- Classic / deprecated starters
- Jackson 3 upgrade
- Config property renames
- Removed features
- Testing changes
- Other release notes to cross-check

## System requirements
- Java 17 minimum, 21+ recommended by Spring — **this project targets Java 25**
- Kotlin 2.2+ if used
- GraalVM native-image v25+ if used
- Jakarta EE 11 / Servlet 6.1 baseline
- Spring Framework 7.x

## Module dependencies (starters & modules)
Spring Boot 4 ships smaller, focused modules instead of a few large jars. A dependency that worked with **no dedicated starter** in 3.x (e.g. Flyway, Liquibase) now needs one.

Naming convention:
- Modules: `spring-boot-<technology>`
- Starters: `spring-boot-starter-<technology>`
- Test starters: `spring-boot-starter-<technology>-test`

**Do not hardcode a fixed dependency list when applying this migration.** Look up whatever the project actually declares. Common ones:

| Technology | Old starter (3.x) | New starter (4.x) |
|---|---|---|
| Web MVC | `spring-boot-starter-web` | `spring-boot-starter-webmvc` |
| Web Services | `spring-boot-starter-web-services` | `spring-boot-starter-webservices` |
| AOP | `spring-boot-starter-aop` | `spring-boot-starter-aspectj` (verify AspectJ is actually used first) |
| OAuth2 Client | `spring-boot-starter-oauth2-client` | `spring-boot-starter-security-oauth2-client` |
| OAuth2 Resource Server | `spring-boot-starter-oauth2-resource-server` | `spring-boot-starter-security-oauth2-resource-server` |
| OAuth2 Authorization Server | `spring-boot-starter-oauth2-authorization-server` | `spring-boot-starter-security-oauth2-authorization-server` |
| Flyway | *(implicit)* | `spring-boot-starter-flyway` |
| Liquibase | *(implicit)* | `spring-boot-starter-liquibase` |
| JDBC | *(implicit)* | `spring-boot-starter-jdbc` |
| GraphQL | *(implicit)* | `spring-boot-starter-graphql` |
| Batch (JDBC-backed) | `spring-boot-starter-batch` | `spring-boot-starter-batch-jdbc` (plain `batch` is now in-memory by default) |
| Tomcat WAR deployment | `spring-boot-starter-tomcat` | `spring-boot-starter-tomcat-runtime` |

For the exhaustive table across all Core/Web/Database/Spring Data/IO/JSON/Messaging/Security/Templating/Production-Ready categories, consult the official guide directly — it's long and versioned; don't copy it verbatim into project memory.

### Classic starters (bridge strategy)
For a large app, migrate in two steps:
1. Add `spring-boot-starter-classic` (+ `spring-boot-starter-test-classic` for tests) — restores all auto-configuration, similar to 3.x behavior. Fix broken imports first.
2. Once stable, remove the classic starters and replace with the specific starters actually needed.

### Deprecated (renamed) starters — still work, but flagged for removal
`spring-boot-starter-web` → `spring-boot-starter-webmvc`
`spring-boot-starter-web-services` → `spring-boot-starter-webservices`
`spring-boot-starter-oauth2-*` → `spring-boot-starter-security-oauth2-*`

## Jackson 3 upgrade
- Group ID change: `com.fasterxml.jackson` → `tools.jackson` (exception: `jackson-annotations` stays on `com.fasterxml.jackson.core`/`.annotation`)
- Renamed classes: `JsonObjectSerializer`→`ObjectValueSerializer`, `JsonValueDeserializer`→`ObjectValueDeserializer`, `Jackson2ObjectMapperBuilderCustomizer`→`JsonMapperBuilderCustomizer`, `@JsonComponent`→`@JacksonComponent`, `@JsonMixin`→`@JacksonMixin`
- Properties: `spring.jackson.read.*`/`write.*` → `spring.jackson.json.read.*`/`json.write.*`
- Auto-configures `JsonMapper` (JSON) and `XmlMapper` (XML) separately — a custom `ObjectMapper` bean is no longer sufficient to replace them
- Need Jackson 2 compatibility? Add `spring-boot-jackson2` (deprecated stop-gap) or set `spring.jackson.use-jackson2-defaults=true`
- Jackson now auto-registers **all** modules on the classpath by default (not just "well-known" ones) — disable via `spring.jackson.find-and-add-modules=false` if that's a problem

## Config property renames
Run `spring-boot-properties-migrator` (see SKILL.md Step 5) rather than hunting these manually — it prints diagnostics at startup and temporarily migrates values. Notable renames to expect:
- `spring.data.mongodb.*` → `spring.mongodb.*` (most keys; a few Spring-Data-specific ones stay under `spring.data.mongodb`)
- `spring.session.redis.*` → `spring.session.data.redis.*`
- `spring.session.mongodb.*` → `spring.session.data.mongodb.*`
- `management.health.mongo.*` → `management.health.mongodb.*`
- `spring.dao.exceptiontranslation.enabled` → `spring.persistence.exceptiontranslation.enabled`
- `spring.kafka.retry.topic.backoff.random` → `spring.kafka.retry.topic.backoff.jitter`

## Removed features
- **Undertow** — dropped entirely (no Servlet 6.1 support). Move to Tomcat, Jetty, or Reactor Netty.
- **Pulsar Reactive** auto-configuration — removed
- **Embedded executable uber-jar launch scripts** — removed; use `java -jar` or Gradle's application plugin
- **Spring Session Hazelcast / MongoDB** — no longer bundled; now maintained by Hazelcast/MongoDB teams directly
- **Spock integration** — removed (Spock doesn't support Groovy 5 yet)
- **Classic uber-jar loader** (`loaderImplementation=CLASSIC` / Gradle equivalent) — remove from build config
- **`org.springframework.lang.Nullable`** on Actuator endpoint params — migrate to `org.jspecify.annotations.Nullable`
- **`PropertyMapper.alwaysApplyingWhenNonNull()`** — removed; use `.always()` for null-inclusive mapping

## Testing changes
- `@MockBean`/`@SpyBean` → `@MockitoBean`/`@MockitoSpyBean` (different placement rules — see official guide for `@Configuration`-class sharing pattern)
- `@SpringBootTest` no longer auto-provides MockMvc — add `@AutoConfigureMockMvc` explicitly
- `@SpringBootTest` no longer auto-provides `WebClient`/`TestRestTemplate` — add `@AutoConfigureTestRestTemplate` + depend on `spring-boot-resttestclient` and `spring-boot-restclient`; consider switching to the new `RestTestClient`
- `@PropertyMapping` moved package: `org.springframework.boot.test.autoconfigure.properties` → `org.springframework.boot.test.context`
- `MockitoTestExecutionListener` removed — use Mockito's own `MockitoExtension` if `@Mock`/`@Captor` stop working

## Other release notes to cross-check
If the project uses these, review their own migration guides before finishing:
- Spring Framework 7.0, Spring Security 7.0, Spring Data 2025.1
- Spring Batch 6.0, Spring Integration 7.0, Spring for Apache Kafka 4.0, Spring AMQP 4.0
- Spring GraphQL 2.0, Spring Session 4.0, Spring REST Docs 4.0, Spring WS 5.0
@echo off
title Market Sniper Shooters - Spring Boot Enterprise Backend
echo =====================================================================
echo  Starting Market Sniper Shooters Enterprise Spring Boot Backend
echo  Port: 8080 ^| Security: Stateless JWT ^| Database: Relational H2/MySQL
echo =====================================================================

if exist "target\market-sniper-backend-1.0.0.jar" (
    java -jar target\market-sniper-backend-1.0.0.jar
) else (
    echo Fat JAR not found. Running with Maven...
    "C:\Users\Koushik Patha\eclipse-workspace\springcore\apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run
)
pause

# Market Sniper Shooters Enterprise Backend PowerShell Launcher
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " Starting Market Sniper Shooters Enterprise Spring Boot Backend" -ForegroundColor Green
Write-Host " Port: 8080 | Security: Stateless JWT | DB: Relational H2/MySQL" -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan

$jarPath = "target\market-sniper-backend-1.0.0.jar"
if (Test-Path $jarPath) {
    java -jar $jarPath
} else {
    & "C:\Users\Koushik Patha\eclipse-workspace\springcore\apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run
}

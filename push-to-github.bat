@echo off
echo ============================================================
echo   PUSHING MARKET PULSE PRO TO GITHUB
echo ============================================================
git add .
git commit -m "Update Market Pulse Pro"
git push -u origin main
echo.
echo All code pushed to: https://github.com/gunda-saivivek/indianmarket
pause

@echo off
title SINAPS School Website - Admin Dashboard
cd /d "D:\sinaps website"
echo ========================================================
echo       SINAPS - St. Ignatius Nursery ^& Primary School
echo                 Admin CMS Dashboard v2.0
echo ========================================================
echo Starting local development server...
echo URL: http://localhost:3000/admin
echo Admin PIN: sinaps2026
echo ========================================================
start "" http://localhost:3000/admin
npm run dev
pause

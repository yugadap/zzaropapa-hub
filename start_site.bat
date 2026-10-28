@echo off
cd /d "%~dp0"
chcp 65001 >nul
title Zzaropapa AI Lab - Hub Site (127.0.0.1:3000)
start "" "http://127.0.0.1:3000"
node server.js

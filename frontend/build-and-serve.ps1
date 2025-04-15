# build-and-serve.ps1
npm run build

Remove-Item ../forecast-api/forecast-api/src/main/resources/static/* -Recurse -Force

Copy-Item -Path build/* -Destination ../forecast-api/forecast-api/src/main/resources/static/ -Recurse

Set-Location ../forecast-api/forecast-api
./gradlew clean bootRun
Set-Location ../../frontend
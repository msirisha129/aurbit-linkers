$path = "C:\Users\msiri\Downloads\aurbit-linkers\aurbit-linkers\frontend\src\App.jsx"
$content = Get-Content $path -Raw
$content = $content -replace "const location = useLocation\(\);\r?\n const hideChrome", "const location = useLocation();`r`n  const navigate = useNavigate();`r`n const hideChrome"
Set-Content $path $content
Write-Host "Done"

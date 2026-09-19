$root = Join-Path $PSScriptRoot 'yuzhuo-final2-preview'
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://127.0.0.1:8765/')
$listener.Start()
while ($listener.IsListening) {
  $context = $listener.GetContext()
  $relative = $context.Request.Url.AbsolutePath.TrimStart('/')
  if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }
  $file = Join-Path $root ($relative -replace '/', '\')
  if (Test-Path -LiteralPath $file -PathType Leaf) {
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $ext = [System.IO.Path]::GetExtension($file).ToLowerInvariant()
    $types = @{'.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.webp'='image/webp'; '.svg'='image/svg+xml'}
    if ($types.ContainsKey($ext)) { $context.Response.ContentType = $types[$ext] }
    $context.Response.StatusCode = 200
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else { $context.Response.StatusCode = 404 }
  $context.Response.Close()
}

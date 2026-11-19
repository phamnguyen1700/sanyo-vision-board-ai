$ErrorActionPreference = "Stop"

$workspace = Split-Path -Parent $PSScriptRoot
$target = Join-Path (Split-Path -Parent $workspace) "sanyo-vision-board-ai-api"

if (Test-Path -LiteralPath $target) {
    $existing = Get-ChildItem -LiteralPath $target -Force -ErrorAction Stop
    if ($existing.Count -gt 0) {
        throw "Target already exists and is not empty: $target"
    }
}
else {
    New-Item -ItemType Directory -Path $target -Force | Out-Null
}

$directories = @(
    ".github\workflows",
    "alembic\versions",
    "docs",
    "infra\prometheus",
    "infra\grafana\dashboards",
    "infra\grafana\provisioning\alerting",
    "infra\grafana\provisioning\dashboards",
    "infra\grafana\provisioning\datasources",
    "scripts",
    "src\app\api\dependencies",
    "src\app\api\routes\admin",
    "src\app\api\routes\players",
    "src\app\background\backpressure",
    "src\app\background\dead_letter",
    "src\app\background\metrics",
    "src\app\background\queue",
    "src\app\background\workers",
    "src\app\core\http",
    "src\app\core\messages",
    "src\app\core\observability",
    "src\app\core\rate_limit",
    "src\app\db",
    "src\app\models\admin",
    "src\app\models\players",
    "src\app\repositories\admin",
    "src\app\repositories\players",
    "src\app\schemas\admin",
    "src\app\schemas\players",
    "src\app\services\admin",
    "src\app\services\players",
    "src\app\services\players\submissions",
    "src\app\workers\players\submissions",
    "tests\unit",
    "tests\integration"
)

foreach ($directory in $directories) {
    New-Item -ItemType Directory -Path (Join-Path $target $directory) -Force | Out-Null
}

$pythonPackages = @(
    "src\app",
    "src\app\api",
    "src\app\api\dependencies",
    "src\app\api\routes",
    "src\app\api\routes\admin",
    "src\app\api\routes\players",
    "src\app\background",
    "src\app\background\backpressure",
    "src\app\background\dead_letter",
    "src\app\background\metrics",
    "src\app\background\queue",
    "src\app\background\workers",
    "src\app\core",
    "src\app\core\http",
    "src\app\core\messages",
    "src\app\core\observability",
    "src\app\core\rate_limit",
    "src\app\db",
    "src\app\models",
    "src\app\models\admin",
    "src\app\models\players",
    "src\app\repositories",
    "src\app\repositories\admin",
    "src\app\repositories\players",
    "src\app\schemas",
    "src\app\schemas\admin",
    "src\app\schemas\players",
    "src\app\services",
    "src\app\services\admin",
    "src\app\services\players",
    "src\app\services\players\submissions",
    "src\app\workers",
    "src\app\workers\players",
    "src\app\workers\players\submissions"
)

foreach ($package in $pythonPackages) {
    New-Item -ItemType File -Path (Join-Path $target "$package\__init__.py") -Force | Out-Null
}

$placeholders = @(
    "alembic\README",
    "infra\prometheus\.gitkeep",
    "infra\grafana\dashboards\.gitkeep",
    "infra\grafana\provisioning\alerting\.gitkeep",
    "infra\grafana\provisioning\dashboards\.gitkeep",
    "infra\grafana\provisioning\datasources\.gitkeep",
    "tests\unit\.gitkeep",
    "tests\integration\.gitkeep"
)

foreach ($placeholder in $placeholders) {
    New-Item -ItemType File -Path (Join-Path $target $placeholder) -Force | Out-Null
}

@"
# Sanyo Vision Board API

Backend skeleton derived from the Panasonic Green Impact API architecture.

This repository currently contains structure only. Domain models, routes,
services, migrations, and runtime configuration will be planned after review.
"@ | Set-Content -LiteralPath (Join-Path $target "README.md") -Encoding UTF8

@"
__pycache__/
.venv/
.env
.pytest_cache/
.mypy_cache/
.ruff_cache/
*.py[cod]
dist/
build/
*.egg-info/
"@ | Set-Content -LiteralPath (Join-Path $target ".gitignore") -Encoding UTF8

Write-Host "Created Sanyo API skeleton at $target"

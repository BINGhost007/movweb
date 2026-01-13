<?php

declare(strict_types=1);

namespace App\Core;

final class Config
{
    public function __construct(
        public readonly string $projectRoot,
        public readonly string $appEnv,
        public readonly string $baseUrl,
        public readonly string $dbPath,
        public readonly string $adminUser,
        public readonly ?string $adminPassword,
        public readonly ?string $adminPasswordHash,
    ) {
    }

    public static function fromEnv(string $projectRoot): self
    {
        $appEnv = Env::get('APP_ENV', 'development') ?? 'development';
        $baseUrl = Env::get('APP_BASE_URL', 'http://localhost:8000') ?? 'http://localhost:8000';

        $dbPath = Env::get('DB_PATH', 'backend/database/app.sqlite') ?? 'backend/database/app.sqlite';
        $dbPath = self::normalizePath($projectRoot, $dbPath);

        $adminUser = Env::get('ADMIN_USER', 'admin') ?? 'admin';
        $adminPassword = Env::get('ADMIN_PASSWORD');
        $adminPasswordHash = Env::get('ADMIN_PASSWORD_HASH');

        return new self(
            projectRoot: $projectRoot,
            appEnv: $appEnv,
            baseUrl: rtrim($baseUrl, '/'),
            dbPath: $dbPath,
            adminUser: $adminUser,
            adminPassword: $adminPassword,
            adminPasswordHash: $adminPasswordHash,
        );
    }

    private static function normalizePath(string $projectRoot, string $path): string
    {
        if (str_starts_with($path, '/')) {
            return $path;
        }

        return rtrim($projectRoot, '/') . '/' . ltrim($path, '/');
    }
}

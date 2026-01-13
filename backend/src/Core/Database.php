<?php

declare(strict_types=1);

namespace App\Core;

use PDO;

final class Database
{
    private ?PDO $pdo = null;

    public function __construct(
        private readonly Config $config,
    ) {
    }

    public function pdo(): PDO
    {
        if ($this->pdo !== null) {
            return $this->pdo;
        }

        $dir = dirname($this->config->dbPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }

        $pdo = new PDO('sqlite:' . $this->config->dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->exec('PRAGMA foreign_keys = ON');

        $this->pdo = $pdo;

        $this->ensureSchema();

        return $this->pdo;
    }

    private function ensureSchema(): void
    {
        $pdo = $this->pdo;
        if ($pdo === null) {
            return;
        }

        $result = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='movies'");
        $moviesTable = $result ? $result->fetchColumn() : false;

        if ($moviesTable) {
            return;
        }

        $schemaFile = $this->config->projectRoot . '/backend/database/schema.sql';
        $schema = is_file($schemaFile) ? file_get_contents($schemaFile) : null;

        if ($schema === null || $schema === false) {
            throw new \RuntimeException('Database schema.sql not found or unreadable at ' . $schemaFile);
        }

        $pdo->exec($schema);
    }
}

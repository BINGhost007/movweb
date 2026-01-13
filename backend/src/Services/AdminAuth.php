<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Config;

final class AdminAuth
{
    private const SESSION_KEY = '_is_admin';

    public function __construct(private readonly Config $config)
    {
    }

    public function isLoggedIn(): bool
    {
        return ($_SESSION[self::SESSION_KEY] ?? false) === true;
    }

    public function requireLogin(): void
    {
        if ($this->isLoggedIn()) {
            return;
        }

        http_response_code(302);
        header('Location: /admin/login');
        exit;
    }

    public function attempt(string $username, string $password): bool
    {
        if ($username !== $this->config->adminUser) {
            return false;
        }

        if (is_string($this->config->adminPasswordHash) && $this->config->adminPasswordHash !== '') {
            if (!password_verify($password, $this->config->adminPasswordHash)) {
                return false;
            }
        } else {
            $expected = $this->config->adminPassword;
            if (!is_string($expected) || $expected === '' || !hash_equals($expected, $password)) {
                return false;
            }
        }

        if (session_status() === PHP_SESSION_ACTIVE) {
            session_regenerate_id(true);
        }

        $_SESSION[self::SESSION_KEY] = true;
        return true;
    }

    public function logout(): void
    {
        unset($_SESSION[self::SESSION_KEY]);

        if (session_status() === PHP_SESSION_ACTIVE) {
            session_regenerate_id(true);
        }
    }
}

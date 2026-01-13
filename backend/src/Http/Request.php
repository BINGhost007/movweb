<?php

declare(strict_types=1);

namespace App\Http;

final class Request
{
    public function __construct(
        private readonly array $server,
        private readonly array $get,
        private readonly array $post,
        private readonly array $files,
    ) {
    }

    public static function fromGlobals(): self
    {
        return new self($_SERVER, $_GET, $_POST, $_FILES);
    }

    public function path(): string
    {
        $uri = $this->server['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH);
        if (!is_string($path) || $path === '') {
            return '/';
        }

        return rtrim($path, '/') ?: '/';
    }

    public function method(): string
    {
        $method = strtoupper((string) ($this->server['REQUEST_METHOD'] ?? 'GET'));
        if ($method === 'POST') {
            $override = $this->post['_method'] ?? null;
            if (is_string($override) && $override !== '') {
                return strtoupper($override);
            }
        }

        return $method;
    }

    public function query(string $key, ?string $default = null): ?string
    {
        $value = $this->get[$key] ?? null;
        if (!is_string($value) || $value === '') {
            return $default;
        }

        return $value;
    }

    public function input(string $key, ?string $default = null): ?string
    {
        $value = $this->post[$key] ?? null;
        if (is_string($value)) {
            $trim = trim($value);
            return $trim === '' ? $default : $trim;
        }

        return $default;
    }

    public function int(string $key, ?int $default = null): ?int
    {
        $value = $this->input($key);
        if ($value === null) {
            return $default;
        }

        if (!preg_match('/^-?\d+$/', $value)) {
            return $default;
        }

        return (int) $value;
    }

    public function float(string $key, ?float $default = null): ?float
    {
        $value = $this->input($key);
        if ($value === null) {
            return $default;
        }

        if (!is_numeric($value)) {
            return $default;
        }

        return (float) $value;
    }

    public function postAll(): array
    {
        return $this->post;
    }
}

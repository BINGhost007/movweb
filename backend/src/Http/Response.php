<?php

declare(strict_types=1);

namespace App\Http;

final class Response
{
    public static function redirect(string $to, int $status = 302): void
    {
        http_response_code($status);
        header('Location: ' . $to);
        exit;
    }
}

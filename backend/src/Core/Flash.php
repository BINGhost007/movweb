<?php

declare(strict_types=1);

namespace App\Core;

final class Flash
{
    private const KEY = '_flash';

    public function set(string $type, string $message): void
    {
        $_SESSION[self::KEY] = [
            'type' => $type,
            'message' => $message,
        ];
    }

    /**
     * @return array{type: string, message: string}|null
     */
    public function pull(): ?array
    {
        $flash = $_SESSION[self::KEY] ?? null;
        unset($_SESSION[self::KEY]);

        if (!is_array($flash) || !isset($flash['type'], $flash['message'])) {
            return null;
        }

        if (!is_string($flash['type']) || !is_string($flash['message'])) {
            return null;
        }

        return [
            'type' => $flash['type'],
            'message' => $flash['message'],
        ];
    }
}

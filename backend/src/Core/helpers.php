<?php

declare(strict_types=1);

function e(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function format_minutes(mixed $minutes): string
{
    $m = (int) $minutes;
    if ($m <= 0) {
        return '';
    }

    $h = intdiv($m, 60);
    $r = $m % 60;

    if ($h <= 0) {
        return $m . 'm';
    }

    if ($r === 0) {
        return $h . 'h';
    }

    return $h . 'h ' . $r . 'm';
}

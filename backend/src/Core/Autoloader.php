<?php

declare(strict_types=1);

namespace App\Core;

final class Autoloader
{
    public static function register(string $srcRoot): void
    {
        $srcRoot = rtrim($srcRoot, '/');

        spl_autoload_register(static function (string $class) use ($srcRoot): void {
            if (!str_starts_with($class, 'App\\')) {
                return;
            }

            $relative = substr($class, 4);
            $relativePath = str_replace('\\', '/', $relative) . '.php';
            $file = $srcRoot . '/' . $relativePath;

            if (is_file($file)) {
                require $file;
            }
        });
    }
}

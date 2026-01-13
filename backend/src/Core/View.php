<?php

declare(strict_types=1);

namespace App\Core;

final class View
{
    public function __construct(
        private readonly string $viewsPath,
        private readonly Csrf $csrf,
        private readonly Flash $flash,
    ) {
    }

    /**
     * @param array<string, mixed> $data
     */
    public function render(string $template, array $data = [], int $status = 200, string $layout = 'partials/layout'): void
    {
        http_response_code($status);

        $csrfToken = $this->csrf->token();
        $flash = $this->flash;

        extract($data, EXTR_SKIP);

        $templateFile = $this->viewsPath . '/' . ltrim($template, '/') . '.php';
        if (!is_file($templateFile)) {
            throw new \RuntimeException('View not found: ' . $templateFile);
        }

        ob_start();
        require $templateFile;
        $content = ob_get_clean();

        $layoutFile = $this->viewsPath . '/' . ltrim($layout, '/') . '.php';
        if (!is_file($layoutFile)) {
            echo $content;
            return;
        }

        require $layoutFile;
    }
}

<?php

declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Core\View;
use App\Http\Request;
use App\Services\AdminAuth;

final class DashboardController
{
    public function __construct(
        private readonly View $view,
        private readonly AdminAuth $auth,
    ) {
    }

    /**
     * @param array<string, string> $params
     */
    public function index(Request $request, array $params = []): void
    {
        $this->auth->requireLogin();

        $this->view->render('admin/dashboard', [
            'title' => 'Admin Dashboard',
        ], 200, 'partials/layout');
    }
}

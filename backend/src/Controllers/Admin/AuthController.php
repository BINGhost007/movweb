<?php

declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Core\Csrf;
use App\Core\Flash;
use App\Core\View;
use App\Http\Request;
use App\Http\Response;
use App\Services\AdminAuth;

final class AuthController
{
    public function __construct(
        private readonly View $view,
        private readonly Csrf $csrf,
        private readonly Flash $flash,
        private readonly AdminAuth $auth,
    ) {
    }

    /**
     * @param array<string, string> $params
     */
    public function loginForm(Request $request, array $params = []): void
    {
        if ($this->auth->isLoggedIn()) {
            Response::redirect('/admin');
        }

        $this->view->render('admin/login', [
            'title' => 'Admin Login',
        ], 200, 'partials/layout');
    }

    /**
     * @param array<string, string> $params
     */
    public function login(Request $request, array $params = []): void
    {
        if (!$this->csrf->validate($request->input('_csrf'))) {
            $this->flash->set('error', 'Invalid session. Please try again.');
            Response::redirect('/admin/login');
        }

        $username = $request->input('username', '') ?? '';
        $password = $request->input('password', '') ?? '';

        if ($this->auth->attempt($username, $password)) {
            $this->flash->set('success', 'Welcome back.');
            Response::redirect('/admin');
        }

        $this->flash->set('error', 'Invalid credentials.');
        Response::redirect('/admin/login');
    }

    /**
     * @param array<string, string> $params
     */
    public function logout(Request $request, array $params = []): void
    {
        if ($this->csrf->validate($request->input('_csrf'))) {
            $this->auth->logout();
        }

        Response::redirect('/');
    }
}

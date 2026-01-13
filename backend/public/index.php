<?php

declare(strict_types=1);

use App\Controllers\Admin\AuthController as AdminAuthController;
use App\Controllers\Admin\CastController as AdminCastController;
use App\Controllers\Admin\DashboardController;
use App\Controllers\Admin\MovieController as AdminMovieController;
use App\Controllers\HomeController;
use App\Controllers\MovieController;
use App\Core\Autoloader;
use App\Core\Config;
use App\Core\Csrf;
use App\Core\Database;
use App\Core\Env;
use App\Core\Flash;
use App\Core\Router;
use App\Core\View;
use App\Http\Request;
use App\Repositories\CastRepository;
use App\Repositories\MovieRepository;
use App\Services\AdminAuth;

$projectRoot = dirname(__DIR__, 2);

if (PHP_SAPI === 'cli-server') {
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    if (is_string($path)) {
        $file = $projectRoot . $path;
        if ($path !== '/' && is_file($file)) {
            return false;
        }
    }
}

require $projectRoot . '/backend/src/Core/helpers.php';
Autoloader::register($projectRoot . '/backend/src');

Env::load($projectRoot);
$config = Config::fromEnv($projectRoot);

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'httponly' => true,
    'samesite' => 'Lax',
]);

session_start();

$csrf = new Csrf();
$flash = new Flash();

$db = new Database($config);
$pdo = $db->pdo();

$moviesRepo = new MovieRepository($pdo);
$castRepo = new CastRepository($pdo);

$view = new View($projectRoot . '/frontend/views', $csrf, $flash);
$adminAuth = new AdminAuth($config);

$homeController = new HomeController($view, $moviesRepo);
$movieController = new MovieController($view, $moviesRepo, $castRepo);

$adminAuthController = new AdminAuthController($view, $csrf, $flash, $adminAuth);
$adminDashboardController = new DashboardController($view, $adminAuth);
$adminMovieController = new AdminMovieController($view, $moviesRepo, $adminAuth, $csrf, $flash);
$adminCastController = new AdminCastController($view, $moviesRepo, $castRepo, $adminAuth, $csrf, $flash);

$router = new Router();

$router->get('/', [$homeController, 'index']);
$router->get('/movie/{id}', [$movieController, 'show']);

$router->get('/admin/login', [$adminAuthController, 'loginForm']);
$router->post('/admin/login', [$adminAuthController, 'login']);
$router->post('/admin/logout', [$adminAuthController, 'logout']);

$router->get('/admin', [$adminDashboardController, 'index']);

$router->get('/admin/movies', [$adminMovieController, 'index']);
$router->get('/admin/movies/new', [$adminMovieController, 'createForm']);
$router->post('/admin/movies', [$adminMovieController, 'store']);
$router->get('/admin/movies/{id}/edit', [$adminMovieController, 'editForm']);
$router->add('PUT', '/admin/movies/{id}', [$adminMovieController, 'update']);
$router->add('DELETE', '/admin/movies/{id}', [$adminMovieController, 'delete']);

$router->get('/admin/movies/{id}/cast', [$adminCastController, 'index']);
$router->post('/admin/movies/{id}/cast', [$adminCastController, 'store']);
$router->add('DELETE', '/admin/movies/{id}/cast/{castId}', [$adminCastController, 'delete']);

$request = Request::fromGlobals();

try {
    $handled = $router->dispatch($request);
    if (!$handled) {
        $view->render('pages/404', ['title' => 'Not found'], 404);
    }
} catch (Throwable $e) {
    if ($config->appEnv === 'development') {
        http_response_code(500);
        header('Content-Type: text/plain; charset=UTF-8');
        echo "Internal Server Error\n\n";
        echo $e;
        exit;
    }

    http_response_code(500);
    $view->render('pages/500', ['title' => 'Server error'], 500);
}

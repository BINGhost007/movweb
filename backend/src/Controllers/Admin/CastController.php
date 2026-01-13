<?php

declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Core\Csrf;
use App\Core\Flash;
use App\Core\View;
use App\Http\Request;
use App\Http\Response;
use App\Repositories\CastRepository;
use App\Repositories\MovieRepository;
use App\Services\AdminAuth;

final class CastController
{
    public function __construct(
        private readonly View $view,
        private readonly MovieRepository $movies,
        private readonly CastRepository $casts,
        private readonly AdminAuth $auth,
        private readonly Csrf $csrf,
        private readonly Flash $flash,
    ) {
    }

    /**
     * @param array<string, string> $params
     */
    public function index(Request $request, array $params): void
    {
        $this->auth->requireLogin();

        $movieId = isset($params['id']) ? (int) $params['id'] : 0;
        $movie = $movieId > 0 ? $this->movies->findById($movieId) : null;
        if ($movie === null) {
            $this->view->render('pages/404', ['title' => 'Not found'], 404);
            return;
        }

        $cast = $this->casts->listByMovieId($movieId);

        $this->view->render('admin/cast', [
            'title' => 'Cast',
            'movie' => $movie,
            'cast' => $cast,
            'errors' => [],
        ], 200, 'partials/layout');
    }

    /**
     * @param array<string, string> $params
     */
    public function store(Request $request, array $params): void
    {
        $this->auth->requireLogin();

        $movieId = isset($params['id']) ? (int) $params['id'] : 0;
        $movie = $movieId > 0 ? $this->movies->findById($movieId) : null;
        if ($movie === null) {
            $this->view->render('pages/404', ['title' => 'Not found'], 404);
            return;
        }

        if (!$this->csrf->validate($request->input('_csrf'))) {
            $this->flash->set('error', 'Invalid session. Please try again.');
            Response::redirect('/admin/movies/' . $movieId . '/cast');
        }

        $actorName = $request->input('actor_name');
        $roleName = $request->input('role_name');

        $errors = [];
        if ($actorName === null || mb_strlen($actorName) < 2) {
            $errors['actor_name'] = 'Actor name is required.';
        }
        if ($roleName === null || mb_strlen($roleName) < 2) {
            $errors['role_name'] = 'Role name is required.';
        }

        if ($errors !== []) {
            $cast = $this->casts->listByMovieId($movieId);
            $this->view->render('admin/cast', [
                'title' => 'Cast',
                'movie' => $movie,
                'cast' => $cast,
                'errors' => $errors,
                'old' => [
                    'actor_name' => $actorName ?? '',
                    'role_name' => $roleName ?? '',
                ],
            ], 422, 'partials/layout');
            return;
        }

        $this->casts->create($movieId, $actorName, $roleName);
        $this->flash->set('success', 'Cast member added.');
        Response::redirect('/admin/movies/' . $movieId . '/cast');
    }

    /**
     * @param array<string, string> $params
     */
    public function delete(Request $request, array $params): void
    {
        $this->auth->requireLogin();

        $movieId = isset($params['id']) ? (int) $params['id'] : 0;
        $castId = isset($params['castId']) ? (int) $params['castId'] : 0;

        if ($movieId <= 0 || $castId <= 0) {
            $this->view->render('pages/404', ['title' => 'Not found'], 404);
            return;
        }

        if (!$this->csrf->validate($request->input('_csrf'))) {
            $this->flash->set('error', 'Invalid session. Please try again.');
            Response::redirect('/admin/movies/' . $movieId . '/cast');
        }

        $this->casts->deleteForMovie($movieId, $castId);
        $this->flash->set('success', 'Cast member removed.');
        Response::redirect('/admin/movies/' . $movieId . '/cast');
    }
}

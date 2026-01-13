<?php

declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Core\Csrf;
use App\Core\Flash;
use App\Core\View;
use App\Http\Request;
use App\Http\Response;
use App\Repositories\MovieRepository;
use App\Services\AdminAuth;

final class MovieController
{
    public function __construct(
        private readonly View $view,
        private readonly MovieRepository $movies,
        private readonly AdminAuth $auth,
        private readonly Csrf $csrf,
        private readonly Flash $flash,
    ) {
    }

    /**
     * @param array<string, string> $params
     */
    public function index(Request $request, array $params = []): void
    {
        $this->auth->requireLogin();

        $movies = $this->movies->list();

        $this->view->render('admin/movies', [
            'title' => 'Movies',
            'movies' => $movies,
        ], 200, 'partials/layout');
    }

    /**
     * @param array<string, string> $params
     */
    public function createForm(Request $request, array $params = []): void
    {
        $this->auth->requireLogin();

        $this->view->render('admin/movie_form', [
            'title' => 'Add Movie',
            'mode' => 'create',
            'movie' => [
                'title' => '',
                'description' => '',
                'poster_url' => '',
                'trailer_url' => '',
                'year' => '',
                'duration' => '',
                'rating' => '',
                'category' => '',
            ],
            'errors' => [],
        ], 200, 'partials/layout');
    }

    /**
     * @param array<string, string> $params
     */
    public function store(Request $request, array $params = []): void
    {
        $this->auth->requireLogin();

        if (!$this->csrf->validate($request->input('_csrf'))) {
            $this->flash->set('error', 'Invalid session. Please try again.');
            Response::redirect('/admin/movies/new');
        }

        [$data, $errors] = $this->validatePayload($request);

        if ($errors !== []) {
            $this->view->render('admin/movie_form', [
                'title' => 'Add Movie',
                'mode' => 'create',
                'movie' => $data,
                'errors' => $errors,
            ], 422, 'partials/layout');
            return;
        }

        $id = $this->movies->create($data);
        $this->flash->set('success', 'Movie created.');
        Response::redirect('/admin/movies/' . $id . '/edit');
    }

    /**
     * @param array<string, string> $params
     */
    public function editForm(Request $request, array $params): void
    {
        $this->auth->requireLogin();

        $id = isset($params['id']) ? (int) $params['id'] : 0;
        $movie = $id > 0 ? $this->movies->findById($id) : null;
        if ($movie === null) {
            $this->view->render('pages/404', ['title' => 'Not found'], 404);
            return;
        }

        $this->view->render('admin/movie_form', [
            'title' => 'Edit Movie',
            'mode' => 'edit',
            'movie' => $movie,
            'errors' => [],
        ], 200, 'partials/layout');
    }

    /**
     * @param array<string, string> $params
     */
    public function update(Request $request, array $params): void
    {
        $this->auth->requireLogin();

        $id = isset($params['id']) ? (int) $params['id'] : 0;
        $movie = $id > 0 ? $this->movies->findById($id) : null;
        if ($movie === null) {
            $this->view->render('pages/404', ['title' => 'Not found'], 404);
            return;
        }

        if (!$this->csrf->validate($request->input('_csrf'))) {
            $this->flash->set('error', 'Invalid session. Please try again.');
            Response::redirect('/admin/movies/' . $id . '/edit');
        }

        [$data, $errors] = $this->validatePayload($request);

        if ($errors !== []) {
            $data['id'] = $id;
            $this->view->render('admin/movie_form', [
                'title' => 'Edit Movie',
                'mode' => 'edit',
                'movie' => $data,
                'errors' => $errors,
            ], 422, 'partials/layout');
            return;
        }

        $this->movies->update($id, $data);
        $this->flash->set('success', 'Movie updated.');
        Response::redirect('/admin/movies/' . $id . '/edit');
    }

    /**
     * @param array<string, string> $params
     */
    public function delete(Request $request, array $params): void
    {
        $this->auth->requireLogin();

        $id = isset($params['id']) ? (int) $params['id'] : 0;
        if ($id <= 0) {
            $this->view->render('pages/404', ['title' => 'Not found'], 404);
            return;
        }

        if (!$this->csrf->validate($request->input('_csrf'))) {
            $this->flash->set('error', 'Invalid session. Please try again.');
            Response::redirect('/admin/movies');
        }

        $this->movies->delete($id);
        $this->flash->set('success', 'Movie deleted.');
        Response::redirect('/admin/movies');
    }

    /**
     * @return array{0: array<string, mixed>, 1: array<string, string>}
     */
    private function validatePayload(Request $request): array
    {
        $title = $request->input('title');
        $description = $request->input('description');
        $posterUrl = $request->input('poster_url');
        $trailerUrl = $request->input('trailer_url');
        $category = $request->input('category');
        $year = $request->int('year');
        $duration = $request->int('duration');
        $rating = $request->float('rating');

        $errors = [];

        if ($title === null || mb_strlen($title) < 2) {
            $errors['title'] = 'Title must be at least 2 characters.';
        }

        if ($description === null || mb_strlen($description) < 10) {
            $errors['description'] = 'Description must be at least 10 characters.';
        }

        if ($category === null || mb_strlen($category) < 2) {
            $errors['category'] = 'Category is required.';
        }

        if ($year === null || $year < 1888 || $year > ((int) date('Y') + 1)) {
            $errors['year'] = 'Year must be a valid year.';
        }

        if ($duration === null || $duration < 1 || $duration > 1000) {
            $errors['duration'] = 'Duration must be in minutes.';
        }

        if ($rating === null || $rating < 0 || $rating > 10) {
            $errors['rating'] = 'Rating must be between 0 and 10.';
        }

        if (!$this->isValidUrl($posterUrl)) {
            $errors['poster_url'] = 'Poster URL must be a valid URL.';
        }

        if (!$this->isValidUrl($trailerUrl)) {
            $errors['trailer_url'] = 'Trailer URL must be a valid URL.';
        }

        $data = [
            'title' => $title ?? '',
            'description' => $description ?? '',
            'poster_url' => $posterUrl ?? '',
            'trailer_url' => $trailerUrl ?? '',
            'year' => $year ?? '',
            'duration' => $duration ?? '',
            'rating' => $rating ?? '',
            'category' => $category ?? '',
        ];

        if ($errors !== []) {
            return [$data, $errors];
        }

        return [[
            'title' => $title,
            'description' => $description,
            'poster_url' => $posterUrl,
            'trailer_url' => $trailerUrl,
            'year' => $year,
            'duration' => $duration,
            'rating' => $rating,
            'category' => $category,
        ], []];
    }

    private function isValidUrl(?string $url): bool
    {
        if (!is_string($url) || $url === '') {
            return false;
        }

        $isValid = filter_var($url, FILTER_VALIDATE_URL) !== false;
        if (!$isValid) {
            return false;
        }

        $scheme = (string) parse_url($url, PHP_URL_SCHEME);
        return in_array(strtolower($scheme), ['http', 'https'], true);
    }
}

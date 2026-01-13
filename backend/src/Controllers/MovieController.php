<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\View;
use App\Http\Request;
use App\Repositories\CastRepository;
use App\Repositories\MovieRepository;

final class MovieController
{
    public function __construct(
        private readonly View $view,
        private readonly MovieRepository $movies,
        private readonly CastRepository $casts,
    ) {
    }

    /**
     * @param array<string, string> $params
     */
    public function show(Request $request, array $params): void
    {
        $id = isset($params['id']) ? (int) $params['id'] : 0;
        if ($id <= 0) {
            $this->view->render('pages/404', ['title' => 'Not found'], 404);
            return;
        }

        $movie = $this->movies->findById($id);
        if ($movie === null) {
            $this->view->render('pages/404', ['title' => 'Not found'], 404);
            return;
        }

        $cast = $this->casts->listByMovieId($id);

        $this->view->render('pages/movie', [
            'title' => (string) $movie['title'],
            'movie' => $movie,
            'cast' => $cast,
        ]);
    }
}

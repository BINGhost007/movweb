<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\View;
use App\Http\Request;
use App\Repositories\MovieRepository;

final class HomeController
{
    public function __construct(
        private readonly View $view,
        private readonly MovieRepository $movies,
    ) {
    }

    /**
     * @param array<string, string> $params
     */
    public function index(Request $request, array $params = []): void
    {
        $q = $request->query('q');
        $category = $request->query('category');

        $movies = $this->movies->list($q, $category);
        $categories = $this->movies->categories();

        $this->view->render('pages/home', [
            'title' => 'Browse',
            'movies' => $movies,
            'categories' => $categories,
            'q' => $q,
            'category' => $category,
        ]);
    }
}

<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class MovieRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function list(?string $query = null, ?string $category = null): array
    {
        $where = [];
        $params = [];

        if (is_string($query) && $query !== '') {
            $where[] = '(title LIKE :q OR description LIKE :q)';
            $params[':q'] = '%' . $query . '%';
        }

        if (is_string($category) && $category !== '') {
            $where[] = 'category = :category';
            $params[':category'] = $category;
        }

        $sql = 'SELECT * FROM movies';
        if ($where !== []) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY year DESC, id DESC';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM movies WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $movie = $stmt->fetch();

        return is_array($movie) ? $movie : null;
    }

    /**
     * @return array<int, string>
     */
    public function categories(): array
    {
        $rows = $this->pdo->query('SELECT DISTINCT category FROM movies ORDER BY category ASC')?->fetchAll();
        if (!is_array($rows)) {
            return [];
        }

        $categories = [];
        foreach ($rows as $row) {
            if (is_array($row) && isset($row['category']) && is_string($row['category'])) {
                $categories[] = $row['category'];
            }
        }

        return $categories;
    }

    public function create(array $data): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO movies (title, description, poster_url, trailer_url, year, duration, rating, category, created_at, updated_at)
             VALUES (:title, :description, :poster_url, :trailer_url, :year, :duration, :rating, :category, datetime(\'now\'), datetime(\'now\'))'
        );

        $stmt->execute([
            ':title' => $data['title'],
            ':description' => $data['description'],
            ':poster_url' => $data['poster_url'],
            ':trailer_url' => $data['trailer_url'],
            ':year' => $data['year'],
            ':duration' => $data['duration'],
            ':rating' => $data['rating'],
            ':category' => $data['category'],
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    public function update(int $id, array $data): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE movies
             SET title = :title,
                 description = :description,
                 poster_url = :poster_url,
                 trailer_url = :trailer_url,
                 year = :year,
                 duration = :duration,
                 rating = :rating,
                 category = :category,
                 updated_at = datetime(\'now\')
             WHERE id = :id'
        );

        $stmt->execute([
            ':id' => $id,
            ':title' => $data['title'],
            ':description' => $data['description'],
            ':poster_url' => $data['poster_url'],
            ':trailer_url' => $data['trailer_url'],
            ':year' => $data['year'],
            ':duration' => $data['duration'],
            ':rating' => $data['rating'],
            ':category' => $data['category'],
        ]);
    }

    public function delete(int $id): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM movies WHERE id = :id');
        $stmt->execute([':id' => $id]);
    }
}

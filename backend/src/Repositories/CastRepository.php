<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class CastRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listByMovieId(int $movieId): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM casts WHERE movie_id = :movie_id ORDER BY id ASC');
        $stmt->execute([':movie_id' => $movieId]);
        return $stmt->fetchAll();
    }

    public function create(int $movieId, string $actorName, string $roleName): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO casts (movie_id, actor_name, role_name, created_at, updated_at)
             VALUES (:movie_id, :actor_name, :role_name, datetime(\'now\'), datetime(\'now\'))'
        );

        $stmt->execute([
            ':movie_id' => $movieId,
            ':actor_name' => $actorName,
            ':role_name' => $roleName,
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    public function deleteForMovie(int $movieId, int $id): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM casts WHERE id = :id AND movie_id = :movie_id');
        $stmt->execute([
            ':id' => $id,
            ':movie_id' => $movieId,
        ]);
    }
}

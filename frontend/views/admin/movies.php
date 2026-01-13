<?php
/** @var array<int, array<string, mixed>> $movies */
/** @var string $csrfToken */
?>
<section class="section">
    <div class="container">
        <div class="admin-header">
            <div>
                <h1>Movies</h1>
                <div class="muted"><?= e(count($movies)) ?> total</div>
            </div>
            <div class="admin-actions">
                <a class="btn btn-primary" href="/admin/movies/new">Add Movie</a>
                <a class="btn btn-ghost" href="/admin">Dashboard</a>
            </div>
        </div>

        <?php if ($movies === []): ?>
            <div class="empty">
                <h3>No movies yet</h3>
                <p class="muted">Add your first movie to start building the catalog.</p>
                <a class="btn btn-primary" href="/admin/movies/new">Add Movie</a>
            </div>
        <?php else: ?>
            <div class="table-wrap">
                <table class="table">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Year</th>
                        <th>Rating</th>
                        <th>Category</th>
                        <th class="right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <?php foreach ($movies as $movie): ?>
                        <tr>
                            <td>
                                <a class="table-link" href="/movie/<?= e($movie['id']) ?>"><?= e($movie['title']) ?></a>
                            </td>
                            <td><?= e($movie['year']) ?></td>
                            <td>★ <?= e(number_format((float) $movie['rating'], 1)) ?></td>
                            <td><?= e($movie['category']) ?></td>
                            <td class="right">
                                <a class="btn btn-small btn-ghost" href="/admin/movies/<?= e($movie['id']) ?>/edit">Edit</a>
                                <a class="btn btn-small btn-ghost" href="/admin/movies/<?= e($movie['id']) ?>/cast">Cast</a>
                                <form class="inline" action="/admin/movies/<?= e($movie['id']) ?>" method="post" onsubmit="return confirm('Delete this movie? This cannot be undone.');">
                                    <input type="hidden" name="_csrf" value="<?= e($csrfToken) ?>">
                                    <input type="hidden" name="_method" value="DELETE">
                                    <button class="btn btn-small btn-danger" type="submit">Delete</button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</section>

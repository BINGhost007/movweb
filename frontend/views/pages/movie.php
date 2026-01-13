<?php
/** @var array<string, mixed> $movie */
/** @var array<int, array<string, mixed>> $cast */
?>
<section class="movie-hero">
    <div class="container movie-hero-inner">
        <div class="movie-hero-poster">
            <img src="<?= e($movie['poster_url']) ?>" alt="<?= e($movie['title']) ?> poster">
        </div>

        <div class="movie-hero-content">
            <div class="breadcrumbs">
                <a href="/">Browse</a>
                <span class="dot">•</span>
                <span><?= e($movie['category']) ?></span>
            </div>

            <h1 class="movie-page-title"><?= e($movie['title']) ?></h1>

            <div class="movie-facts">
                <span class="pill"><?= e($movie['year']) ?></span>
                <span class="pill"><?= e(format_minutes($movie['duration'])) ?></span>
                <span class="pill">★ <?= e(number_format((float) $movie['rating'], 1)) ?> / 10</span>
                <span class="pill pill-accent"><?= e($movie['category']) ?></span>
            </div>

            <p class="movie-desc"><?= e($movie['description']) ?></p>

            <div class="movie-actions">
                <a class="btn btn-primary" href="<?= e($movie['trailer_url']) ?>" target="_blank" rel="noopener noreferrer">Watch Trailer</a>
                <a class="btn btn-ghost" href="/admin/movies/<?= e($movie['id']) ?>/edit">Edit (Admin)</a>
            </div>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="section-header">
            <h2>Cast</h2>
            <div class="muted">Actors and roles</div>
        </div>

        <?php if ($cast === []): ?>
            <div class="empty compact">
                <p class="muted">No cast members yet.</p>
                <a class="btn btn-ghost" href="/admin/movies/<?= e($movie['id']) ?>/cast">Add cast</a>
            </div>
        <?php else: ?>
            <div class="cast-grid">
                <?php foreach ($cast as $member): ?>
                    <div class="cast-card">
                        <div class="cast-name"><?= e($member['actor_name']) ?></div>
                        <div class="cast-role muted"><?= e($member['role_name']) ?></div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>

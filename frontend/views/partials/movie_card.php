<?php
/** @var array<string, mixed> $movie */
?>
<a class="movie-card" href="/movie/<?= e($movie['id']) ?>">
    <div class="movie-poster">
        <img src="<?= e($movie['poster_url']) ?>" alt="<?= e($movie['title']) ?> poster" loading="lazy">
    </div>
    <div class="movie-meta">
        <div class="movie-title" title="<?= e($movie['title']) ?>"><?= e($movie['title']) ?></div>
        <div class="movie-sub">
            <span><?= e($movie['year']) ?></span>
            <span class="dot">•</span>
            <span class="pill"><?= e($movie['category']) ?></span>
            <span class="dot">•</span>
            <span class="rating">★ <?= e(number_format((float) $movie['rating'], 1)) ?></span>
        </div>
    </div>
</a>

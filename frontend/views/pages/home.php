<?php
/** @var array<int, array<string, mixed>> $movies */
/** @var array<int, string> $categories */
/** @var string|null $q */
/** @var string|null $category */
?>
<section class="hero">
    <div class="container hero-inner">
        <div class="hero-copy">
            <h1>Discover your next favorite movie</h1>
            <p class="muted">Browse, filter by genre, and dive into full movie details with cast and trailers.</p>
            <div class="hero-actions">
                <a class="btn btn-primary" href="#browse">Browse now</a>
                <a class="btn btn-ghost" href="/admin">Manage catalog</a>
            </div>
        </div>
        <div class="hero-panel">
            <div class="hero-badge">Premium Dark UI</div>
            <div class="hero-stat">
                <div class="stat-num"><?= e(count($movies)) ?></div>
                <div class="stat-label">Movies in catalog</div>
            </div>
        </div>
    </div>
</section>

<section id="browse" class="section">
    <div class="container">
        <div class="section-header">
            <div>
                <h2>Browse</h2>
                <?php if (($q ?? '') !== '' || ($category ?? '') !== ''): ?>
                    <div class="muted">
                        Showing results
                        <?php if (($q ?? '') !== ''): ?> for “<?= e($q) ?>”<?php endif; ?>
                        <?php if (($category ?? '') !== ''): ?> in <?= e($category) ?><?php endif; ?>
                    </div>
                <?php else: ?>
                    <div class="muted">All movies</div>
                <?php endif; ?>
            </div>
        </div>

        <div class="filters">
            <a class="chip <?= ($category ?? '') === '' ? 'active' : '' ?>" href="/<?= ($q ?? '') !== '' ? ('?q=' . urlencode($q)) : '' ?>">All</a>
            <?php foreach ($categories as $cat): ?>
                <?php $href = '/?category=' . urlencode($cat) . (($q ?? '') !== '' ? ('&q=' . urlencode($q)) : ''); ?>
                <a class="chip <?= ($category ?? '') === $cat ? 'active' : '' ?>" href="<?= e($href) ?>"><?= e($cat) ?></a>
            <?php endforeach; ?>
        </div>

        <?php if ($movies === []): ?>
            <div class="empty">
                <h3>No movies found</h3>
                <p class="muted">Try a different search, remove filters, or add movies from the admin dashboard.</p>
                <a class="btn btn-primary" href="/admin/movies/new">Add a movie</a>
            </div>
        <?php else: ?>
            <div class="grid">
                <?php foreach ($movies as $movie): ?>
                    <?php require __DIR__ . '/../partials/movie_card.php'; ?>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>

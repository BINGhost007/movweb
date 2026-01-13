<?php
/** @var string $mode */
/** @var array<string, mixed> $movie */
/** @var array<string, string> $errors */
/** @var string $csrfToken */

$isEdit = ($mode ?? 'create') === 'edit';
$action = $isEdit ? ('/admin/movies/' . (int) $movie['id']) : '/admin/movies';
?>
<section class="section">
    <div class="container">
        <div class="admin-header">
            <div>
                <h1><?= $isEdit ? 'Edit Movie' : 'Add Movie' ?></h1>
                <div class="muted">Fill in the metadata used across the site.</div>
            </div>
            <div class="admin-actions">
                <a class="btn btn-ghost" href="/admin/movies">Back to movies</a>
                <?php if ($isEdit): ?>
                    <a class="btn btn-ghost" href="/movie/<?= e($movie['id']) ?>">View</a>
                    <a class="btn btn-ghost" href="/admin/movies/<?= e($movie['id']) ?>/cast">Cast</a>
                <?php endif; ?>
            </div>
        </div>

        <form class="form card" action="<?= e($action) ?>" method="post">
            <input type="hidden" name="_csrf" value="<?= e($csrfToken) ?>">
            <?php if ($isEdit): ?>
                <input type="hidden" name="_method" value="PUT">
            <?php endif; ?>

            <div class="two-col">
                <label class="field">
                    <span>Title</span>
                    <input type="text" name="title" value="<?= e($movie['title'] ?? '') ?>" required>
                    <?php if (isset($errors['title'])): ?><div class="error"><?= e($errors['title']) ?></div><?php endif; ?>
                </label>

                <label class="field">
                    <span>Category / Genre</span>
                    <input type="text" name="category" value="<?= e($movie['category'] ?? '') ?>" required>
                    <?php if (isset($errors['category'])): ?><div class="error"><?= e($errors['category']) ?></div><?php endif; ?>
                </label>
            </div>

            <label class="field">
                <span>Description</span>
                <textarea name="description" rows="5" required><?= e($movie['description'] ?? '') ?></textarea>
                <?php if (isset($errors['description'])): ?><div class="error"><?= e($errors['description']) ?></div><?php endif; ?>
            </label>

            <div class="two-col">
                <label class="field">
                    <span>Poster URL</span>
                    <input type="url" name="poster_url" value="<?= e($movie['poster_url'] ?? '') ?>" required>
                    <?php if (isset($errors['poster_url'])): ?><div class="error"><?= e($errors['poster_url']) ?></div><?php endif; ?>
                </label>

                <label class="field">
                    <span>Trailer URL (YouTube)</span>
                    <input type="url" name="trailer_url" value="<?= e($movie['trailer_url'] ?? '') ?>" required>
                    <?php if (isset($errors['trailer_url'])): ?><div class="error"><?= e($errors['trailer_url']) ?></div><?php endif; ?>
                </label>
            </div>

            <div class="three-col">
                <label class="field">
                    <span>Year</span>
                    <input type="number" name="year" min="1888" max="<?= e((int) date('Y') + 1) ?>" value="<?= e($movie['year'] ?? '') ?>" required>
                    <?php if (isset($errors['year'])): ?><div class="error"><?= e($errors['year']) ?></div><?php endif; ?>
                </label>

                <label class="field">
                    <span>Duration (minutes)</span>
                    <input type="number" name="duration" min="1" max="1000" value="<?= e($movie['duration'] ?? '') ?>" required>
                    <?php if (isset($errors['duration'])): ?><div class="error"><?= e($errors['duration']) ?></div><?php endif; ?>
                </label>

                <label class="field">
                    <span>Rating (0-10)</span>
                    <input type="number" name="rating" min="0" max="10" step="0.1" value="<?= e($movie['rating'] ?? '') ?>" required>
                    <?php if (isset($errors['rating'])): ?><div class="error"><?= e($errors['rating']) ?></div><?php endif; ?>
                </label>
            </div>

            <div class="form-actions">
                <button class="btn btn-primary" type="submit"><?= $isEdit ? 'Save Changes' : 'Create Movie' ?></button>
            </div>
        </form>

        <?php if ($isEdit): ?>
            <form class="inline" action="/admin/movies/<?= e($movie['id']) ?>" method="post" onsubmit="return confirm('Delete this movie? This cannot be undone.');">
                <input type="hidden" name="_csrf" value="<?= e($csrfToken) ?>">
                <input type="hidden" name="_method" value="DELETE">
                <button class="btn btn-danger" type="submit">Delete</button>
            </form>
        <?php endif; ?>

        <?php if (($movie['poster_url'] ?? '') !== ''): ?>
            <div class="preview">
                <div class="preview-label muted">Poster preview</div>
                <img class="preview-img" src="<?= e($movie['poster_url']) ?>" alt="Poster preview">
            </div>
        <?php endif; ?>
    </div>
</section>

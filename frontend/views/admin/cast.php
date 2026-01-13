<?php
/** @var array<string, mixed> $movie */
/** @var array<int, array<string, mixed>> $cast */
/** @var array<string, string> $errors */
/** @var array<string, string>|null $old */
/** @var string $csrfToken */

$old = $old ?? ['actor_name' => '', 'role_name' => ''];
?>
<section class="section">
    <div class="container">
        <div class="admin-header">
            <div>
                <h1>Cast</h1>
                <div class="muted"><?= e($movie['title']) ?></div>
            </div>
            <div class="admin-actions">
                <a class="btn btn-ghost" href="/admin/movies/<?= e($movie['id']) ?>/edit">Back to movie</a>
                <a class="btn btn-ghost" href="/movie/<?= e($movie['id']) ?>">View</a>
            </div>
        </div>

        <div class="card">
            <h2 class="h3">Add cast member</h2>
            <form class="form" action="/admin/movies/<?= e($movie['id']) ?>/cast" method="post">
                <input type="hidden" name="_csrf" value="<?= e($csrfToken) ?>">

                <div class="two-col">
                    <label class="field">
                        <span>Actor name</span>
                        <input type="text" name="actor_name" value="<?= e($old['actor_name']) ?>" required>
                        <?php if (isset($errors['actor_name'])): ?><div class="error"><?= e($errors['actor_name']) ?></div><?php endif; ?>
                    </label>

                    <label class="field">
                        <span>Role</span>
                        <input type="text" name="role_name" value="<?= e($old['role_name']) ?>" required>
                        <?php if (isset($errors['role_name'])): ?><div class="error"><?= e($errors['role_name']) ?></div><?php endif; ?>
                    </label>
                </div>

                <button class="btn btn-primary" type="submit">Add</button>
            </form>
        </div>

        <div class="card">
            <h2 class="h3">Current cast</h2>

            <?php if ($cast === []): ?>
                <div class="muted">No cast members added yet.</div>
            <?php else: ?>
                <div class="table-wrap">
                    <table class="table">
                        <thead>
                        <tr>
                            <th>Actor</th>
                            <th>Role</th>
                            <th class="right">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php foreach ($cast as $member): ?>
                            <tr>
                                <td><?= e($member['actor_name']) ?></td>
                                <td><?= e($member['role_name']) ?></td>
                                <td class="right">
                                    <form class="inline" action="/admin/movies/<?= e($movie['id']) ?>/cast/<?= e($member['id']) ?>" method="post" onsubmit="return confirm('Remove this cast member?');">
                                        <input type="hidden" name="_csrf" value="<?= e($csrfToken) ?>">
                                        <input type="hidden" name="_method" value="DELETE">
                                        <button class="btn btn-small btn-danger" type="submit">Remove</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>

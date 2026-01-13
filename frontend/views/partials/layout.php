<?php
/** @var string $title */
/** @var string $content */
/** @var string $csrfToken */
/** @var \App\Core\Flash $flash */

$flashMessage = $flash->pull();
$isAdmin = ($_SESSION['_is_admin'] ?? false) === true;
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="dark">
    <title><?= e($title ?? 'StreamBox') ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
<header class="site-header">
    <div class="container header-inner">
        <a class="brand" href="/">
            <span class="brand-mark">S</span>
            <span class="brand-name">StreamBox</span>
        </a>

        <form class="search" action="/" method="get" role="search">
            <input class="search-input" type="search" name="q" placeholder="Search movies" value="<?= e($_GET['q'] ?? '') ?>" autocomplete="off">
            <button class="btn btn-ghost" type="submit">Search</button>
        </form>

        <nav class="nav">
            <a class="nav-link" href="/">Browse</a>
            <a class="nav-link" href="/admin">Admin</a>
            <?php if ($isAdmin): ?>
                <form action="/admin/logout" method="post" class="inline">
                    <input type="hidden" name="_csrf" value="<?= e($csrfToken) ?>">
                    <button class="nav-link btn-link" type="submit">Logout</button>
                </form>
            <?php else: ?>
                <a class="nav-link" href="/admin/login">Login</a>
            <?php endif; ?>
        </nav>
    </div>
</header>

<main class="site-main">
    <div class="container">
        <?php if ($flashMessage): ?>
            <div class="flash flash-<?= e($flashMessage['type']) ?>" role="status">
                <?= e($flashMessage['message']) ?>
            </div>
        <?php endif; ?>
    </div>

    <?= $content ?>
</main>

<footer class="site-footer">
    <div class="container footer-inner">
        <div>
            <div class="footer-brand">StreamBox</div>
            <div class="muted">A modern movie catalog UI with clean URLs and an admin CMS.</div>
        </div>
        <div class="footer-links">
            <a href="/">Home</a>
            <a href="/admin">Admin</a>
        </div>
    </div>
</footer>

<script src="/assets/js/app.js" defer></script>
</body>
</html>

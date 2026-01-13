<?php
/** @var string $csrfToken */
?>
<section class="section">
    <div class="container">
        <div class="auth-card">
            <h1>Admin Login</h1>
            <p class="muted">Sign in to manage movies and cast.</p>

            <form class="form" action="/admin/login" method="post">
                <input type="hidden" name="_csrf" value="<?= e($csrfToken) ?>">

                <label class="field">
                    <span>Username</span>
                    <input type="text" name="username" autocomplete="username" required>
                </label>

                <label class="field">
                    <span>Password</span>
                    <input type="password" name="password" autocomplete="current-password" required>
                </label>

                <button class="btn btn-primary" type="submit">Login</button>
            </form>

            <div class="muted small">
                Default credentials are configured via <code>.env</code> (see <code>.env.example</code>).
            </div>
        </div>
    </div>
</section>

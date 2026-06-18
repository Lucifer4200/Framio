<?php

// Load autoloader
require_once __DIR__ . '/../app/autoload.php';

// Load environment variables
$env = parse_ini_file(__DIR__ . '/../.env');

// Set environment variables as constants
foreach ($env as $key => $value) {
    if (!defined($key)) {
        define($key, $value);
    }
}

// Load API routes
require_once __DIR__ . '/../routes/api.php';

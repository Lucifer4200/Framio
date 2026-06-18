<?php

function env($key, $default = null)
{
    $envFile = __DIR__ . '/../../.env';
    
    if (!file_exists($envFile)) {
        return $default;
    }
    
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $envValues = [];
    
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $envValues[trim($name)] = trim($value);
        }
    }
    
    return isset($envValues[$key]) ? $envValues[$key] : $default;
}

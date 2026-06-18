<?php

namespace App\Http;

/**
 * Professional Router Class
 * Provides Laravel-like routing capabilities with resource routes and grouping
 */
class Router
{
    private static $routes = [];
    private static $currentGroup = [];
    private static $namedRoutes = [];

    /**
     * Define a GET route
     */
    public static function get($path, $handler)
    {
        self::addRoute('GET', $path, $handler);
    }

    /**
     * Define a POST route
     */
    public static function post($path, $handler)
    {
        self::addRoute('POST', $path, $handler);
    }

    /**
     * Define a PUT route
     */
    public static function put($path, $handler)
    {
        self::addRoute('PUT', $path, $handler);
    }

    /**
     * Define a DELETE route
     */
    public static function delete($path, $handler)
    {
        self::addRoute('DELETE', $path, $handler);
    }

    /**
     * Define a PATCH route
     */
    public static function patch($path, $handler)
    {
        self::addRoute('PATCH', $path, $handler);
    }

    /**
     * Create a route group with shared attributes
     */
    public static function group(array $attributes, callable $callback)
    {
        $previousGroup = self::$currentGroup;
        
        // Merge group attributes
        self::$currentGroup = array_merge(self::$currentGroup, $attributes);
        
        // Execute the callback
        $callback();
        
        // Restore previous group
        self::$currentGroup = $previousGroup;
    }

    /**
     * Create API resource routes (index, store, show, update, destroy)
     */
    public static function apiResource($name, $controller, $options = [])
    {
        $baseUri = $options['prefix'] ?? '';
        $baseUri = rtrim($baseUri, '/') . '/' . $name;
        
        // Index
        self::get($baseUri, [$controller, 'index'])->name("{$name}.index");
        
        // Store
        self::post($baseUri, [$controller, 'store'])->name("{$name}.store");
        
        // Show
        self::get($baseUri . '/{id}', [$controller, 'show'])->name("{$name}.show");
        
        // Update
        self::put($baseUri . '/{id}', [$controller, 'update'])->name("{$name}.update");
        
        // Destroy
        self::delete($baseUri . '/{id}', [$controller, 'destroy'])->name("{$name}.destroy");
    }

    /**
     * Create resource routes with all CRUD methods including create/edit
     */
    public static function resource($name, $controller, $options = [])
    {
        $baseUri = $options['prefix'] ?? '';
        $baseUri = rtrim($baseUri, '/') . '/' . $name;
        
        // Index
        self::get($baseUri, [$controller, 'index'])->name("{$name}.index");
        
        // Create
        self::get($baseUri . '/create', [$controller, 'create'])->name("{$name}.create");
        
        // Store
        self::post($baseUri, [$controller, 'store'])->name("{$name}.store");
        
        // Show
        self::get($baseUri . '/{id}', [$controller, 'show'])->name("{$name}.show");
        
        // Edit
        self::get($baseUri . '/{id}/edit', [$controller, 'edit'])->name("{$name}.edit");
        
        // Update
        self::put($baseUri . '/{id}', [$controller, 'update'])->name("{$name}.update");
        
        // Destroy
        self::delete($baseUri . '/{id}', [$controller, 'destroy'])->name("{$name}.destroy");
    }

    /**
     * Create a controller-specific route group
     */
    public static function controller($controller)
    {
        return new ControllerRouteGroup($controller);
    }

    /**
     * Add a route to the collection
     */
    private static function addRoute($method, $path, $handler)
    {
        // Apply group prefix
        if (isset(self::$currentGroup['prefix'])) {
            $path = rtrim(self::$currentGroup['prefix'], '/') . '/' . ltrim($path, '/');
        }

        // Apply group middleware
        $middleware = self::$currentGroup['middleware'] ?? [];

        $route = new Route($method, $path, $handler, $middleware);
        self::$routes[] = $route;

        return $route;
    }

    /**
     * Dispatch the current request
     */
    public static function dispatch()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $requestUri = $_SERVER['REQUEST_URI'];
        $scriptName = $_SERVER['SCRIPT_NAME'];
        
        // Get the path
        $path = str_replace(dirname($scriptName), '', $requestUri);
        $path = str_replace('/api/v1', '', $path);
        $path = rtrim($path, '/');

        // Handle empty path
        if (empty($path) || $path === '/') {
            http_response_code(200);
            echo json_encode([
                'message' => 'Framio API',
                'version' => '1.0.0',
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            exit;
        }

        // Find matching route
        foreach (self::$routes as $route) {
            if ($route->matches($method, $path)) {
                $route->run();
                return;
            }
        }

        // No route found
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Route not found',
            'path' => $path,
            'method' => $method
        ]);
    }

    /**
     * Get all registered routes (for debugging)
     */
    public static function getRoutes()
    {
        return self::$routes;
    }

    /**
     * Clear all routes
     */
    public static function clear()
    {
        self::$routes = [];
        self::$namedRoutes = [];
        self::$currentGroup = [];
    }
}

/**
 * Route Class
 */
class Route
{
    private $method;
    private $path;
    private $handler;
    private $middleware;
    private $name;
    private $parameters = [];

    public function __construct($method, $path, $handler, $middleware = [])
    {
        $this->method = $method;
        $this->path = $path;
        $this->handler = $handler;
        $this->middleware = $middleware;
    }

    /**
     * Check if route matches the request
     */
    public function matches($method, $path)
    {
        if ($this->method !== $method) {
            return false;
        }

        // Convert route path to regex pattern
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '([^/]+)', $this->path);
        $pattern = '#^' . $pattern . '$#';

        if (!preg_match($pattern, $path, $matches)) {
            return false;
        }

        // Extract parameters
        preg_match_all('/\{([a-zA-Z0-9_]+)\}/', $this->path, $paramNames);
        $this->parameters = array_combine($paramNames[1], array_slice($matches, 1));

        return true;
    }

    /**
     * Execute the route handler
     */
    public function run()
    {
        try {
            // Run middleware
            foreach ($this->middleware as $middleware) {
                if (!call_user_func($middleware)) {
                    return;
                }
            }

            // Execute handler
            if (is_array($this->handler)) {
                $controller = $this->handler[0];
                $method = $this->handler[1];
                
                if (is_string($controller)) {
                    $controller = new $controller();
                }
                
                call_user_func_array([$controller, $method], $this->parameters);
            } elseif (is_callable($this->handler)) {
                call_user_func_array($this->handler, $this->parameters);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Set route name
     */
    public function name($name)
    {
        $this->name = $name;
        Router::$namedRoutes[$name] = $this;
        return $this;
    }

    /**
     * Get route name
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Get route parameters
     */
    public function getParameters()
    {
        return $this->parameters;
    }
}

/**
 * Controller Route Group Class
 */
class ControllerRouteGroup
{
    private $controller;

    public function __construct($controller)
    {
        $this->controller = $controller;
    }

    /**
     * Add routes within controller group
     */
    public function group(callable $callback)
    {
        $previousController = Router::$currentGroup['controller'] ?? null;
        Router::$currentGroup['controller'] = $this->controller;
        
        $callback();
        
        Router::$currentGroup['controller'] = $previousController;
    }

    /**
     * Magic method to handle dynamic route definitions
     */
    public function __call($method, $arguments)
    {
        // This allows for more fluent controller route definitions
        return Router::$method(...$arguments);
    }
}

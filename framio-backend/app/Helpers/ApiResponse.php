<?php

namespace App\Helpers;

class ApiResponse
{
    /**
     * Send a success response
     *
     * @param mixed $data The data to return
     * @param string $message Success message
     * @param int $statusCode HTTP status code
     * @return void
     */
    public static function success($data = null, $message = 'Success', $statusCode = 200)
    {
        http_response_code($statusCode);
        
        $response = [
            'success' => true,
            'message' => $message,
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        echo json_encode($response);
        exit;
    }
    
    /**
     * Send an error response
     *
     * @param string $message Error message
     * @param int $statusCode HTTP status code
     * @param mixed $errors Additional error details
     * @return void
     */
    public static function error($message = 'Error', $statusCode = 400, $errors = null)
    {
        http_response_code($statusCode);
        
        $response = [
            'success' => false,
            'message' => $message,
        ];
        
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        
        echo json_encode($response);
        exit;
    }
    
    /**
     * Send a validation error response
     *
     * @param array $errors Validation errors
     * @param string $message Error message
     * @return void
     */
    public static function validationError($errors, $message = 'Validation failed')
    {
        self::error($message, 422, $errors);
    }
    
    /**
     * Send an unauthorized response
     *
     * @param string $message Error message
     * @return void
     */
    public static function unauthorized($message = 'Unauthorized')
    {
        self::error($message, 401);
    }
    
    /**
     * Send a forbidden response
     *
     * @param string $message Error message
     * @return void
     */
    public static function forbidden($message = 'Forbidden')
    {
        self::error($message, 403);
    }
    
    /**
     * Send a not found response
     *
     * @param string $message Error message
     * @return void
     */
    public static function notFound($message = 'Resource not found')
    {
        self::error($message, 404);
    }
    
    /**
     * Send a server error response
     *
     * @param string $message Error message
     * @return void
     */
    public static function serverError($message = 'Internal server error')
    {
        self::error($message, 500);
    }
    
    /**
     * Send a created response
     *
     * @param mixed $data The data to return
     * @param string $message Success message
     * @return void
     */
    public static function created($data = null, $message = 'Resource created successfully')
    {
        self::success($data, $message, 201);
    }
    
    /**
     * Send an accepted response
     *
     * @param mixed $data The data to return
     * @param string $message Success message
     * @return void
     */
    public static function accepted($data = null, $message = 'Request accepted')
    {
        self::success($data, $message, 202);
    }
    
    /**
     * Send a no content response
     *
     * @return void
     */
    public static function noContent()
    {
        http_response_code(204);
        exit;
    }
}

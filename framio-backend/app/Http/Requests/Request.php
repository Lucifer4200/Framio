<?php

namespace App\Http\Requests;

use App\Helpers\ApiResponse;

abstract class Request
{
    protected $data;
    protected $errors = [];
    
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    abstract public function rules();
    
    /**
     * Get custom error messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [];
    }
    
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }
    
    /**
     * Create a new request instance
     */
    public function __construct()
    {
        $this->data = json_decode(file_get_contents('php://input'), true) ?? [];
        // Merge with GET parameters for GET requests
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $this->data = array_merge($this->data, $_GET);
        }
        
        // Auto-validate on construction
        $this->validate();
    }
    
    /**
     * Validate the request
     *
     * @return bool
     */
    public function validate()
    {
        // Check authorization
        if (!$this->authorize()) {
            ApiResponse::forbidden('You are not authorized to perform this action');
        }
        
        $rules = $this->rules();
        $messages = $this->messages();
        
        foreach ($rules as $field => $fieldRules) {
            if (is_string($fieldRules)) {
                $fieldRules = explode('|', $fieldRules);
            }
            
            foreach ($fieldRules as $rule) {
                $this->validateField($field, $rule, $messages);
            }
        }
        
        if (!empty($this->errors)) {
            ApiResponse::validationError($this->errors, 'Validation failed');
        }
        
        return true;
    }
    
    /**
     * Validate a single field
     *
     * @param string $field
     * @param string $rule
     * @param array $messages
     * @return void
     */
    protected function validateField($field, $rule, $messages = [])
    {
        $value = $this->get($field);
        $ruleName = $rule;
        $ruleParameters = [];
        
        // Parse rule parameters (e.g., "min:3", "max:255")
        if (strpos($rule, ':') !== false) {
            $parts = explode(':', $rule, 2);
            $ruleName = $parts[0];
            $ruleParameters = explode(',', $parts[1]);
        }
        
        $errorMessage = $this->getErrorMessage($field, $ruleName, $ruleParameters, $messages);
        
        switch ($ruleName) {
            case 'required':
                if (empty($value) && $value !== '0' && $value !== 0) {
                    $this->errors[$field][] = $errorMessage;
                }
                break;
                
            case 'email':
                if (!empty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $this->errors[$field][] = $errorMessage;
                }
                break;
                
            case 'min':
                $min = $ruleParameters[0] ?? 0;
                if (strlen($value) < $min) {
                    $this->errors[$field][] = $errorMessage;
                }
                break;
                
            case 'max':
                $max = $ruleParameters[0] ?? 255;
                if (strlen($value) > $max) {
                    $this->errors[$field][] = $errorMessage;
                }
                break;
                
            case 'numeric':
                if (!empty($value) && !is_numeric($value)) {
                    $this->errors[$field][] = $errorMessage;
                }
                break;
                
            case 'integer':
                if (!empty($value) && !filter_var($value, FILTER_VALIDATE_INT)) {
                    $this->errors[$field][] = $errorMessage;
                }
                break;
                
            case 'url':
                if (!empty($value) && !filter_var($value, FILTER_VALIDATE_URL)) {
                    $this->errors[$field][] = $errorMessage;
                }
                break;
                
            case 'confirmed':
                $confirmationField = $field . '_confirmation';
                $confirmationValue = $this->get($confirmationField);
                if ($value !== $confirmationValue) {
                    $this->errors[$field][] = $errorMessage;
                }
                break;
                
            case 'in':
                $allowedValues = $ruleParameters;
                if (!empty($value) && !in_array($value, $allowedValues)) {
                    $this->errors[$field][] = $errorMessage;
                }
                break;
                
            case 'regex':
                $pattern = $ruleParameters[0] ?? '';
                if (!empty($value) && !preg_match($pattern, $value)) {
                    $this->errors[$field][] = $errorMessage;
                }
                break;
        }
    }
    
    /**
     * Get error message for a validation rule
     *
     * @param string $field
     * @param string $rule
     * @param array $parameters
     * @param array $customMessages
     * @return string
     */
    protected function getErrorMessage($field, $rule, $parameters = [], $customMessages = [])
    {
        // Check for custom message
        $customKey = "{$field}.{$rule}";
        if (isset($customMessages[$customKey])) {
            return $customMessages[$customKey];
        }
        
        // Default messages
        $fieldLabel = ucfirst(str_replace('_', ' ', $field));
        
        switch ($rule) {
            case 'required':
                return "{$fieldLabel} is required";
            case 'email':
                return "{$fieldLabel} must be a valid email address";
            case 'min':
                return "{$fieldLabel} must be at least {$parameters[0]} characters";
            case 'max':
                return "{$fieldLabel} must not exceed {$parameters[0]} characters";
            case 'numeric':
                return "{$fieldLabel} must be a number";
            case 'integer':
                return "{$fieldLabel} must be an integer";
            case 'url':
                return "{$fieldLabel} must be a valid URL";
            case 'confirmed':
                return "{$fieldLabel} confirmation does not match";
            case 'in':
                return "{$fieldLabel} must be one of: " . implode(', ', $parameters);
            case 'regex':
                return "{$fieldLabel} format is invalid";
            default:
                return "{$fieldLabel} is invalid";
        }
    }
    
    /**
     * Get request data
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get($key, $default = null)
    {
        return $this->data[$key] ?? $default;
    }
    
    /**
     * Get all request data
     *
     * @return array
     */
    public function all()
    {
        return $this->data;
    }
    
    /**
     * Get only specified fields from request
     *
     * @param array $keys
     * @return array
     */
    public function only($keys)
    {
        return array_intersect_key($this->data, array_flip($keys));
    }
    
    /**
     * Get all fields except specified ones
     *
     * @param array $keys
     * @return array
     */
    public function except($keys)
    {
        return array_diff_key($this->data, array_flip($keys));
    }
    
    /**
     * Check if a field exists in the request
     *
     * @param string $key
     * @return bool
     */
    public function has($key)
    {
        return isset($this->data[$key]);
    }
    
    /**
     * Merge additional data into the request
     *
     * @param array $data
     * @return void
     */
    public function merge($data)
    {
        $this->data = array_merge($this->data, $data);
    }
}

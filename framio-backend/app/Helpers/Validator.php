<?php

namespace App\Helpers;

class Validator
{
    protected $errors = [];
    protected $data;
    
    public function __construct(array $data)
    {
        $this->data = $data;
    }
    
    public static function make(array $data, array $rules)
    {
        $validator = new self($data);
        $validator->validate($rules);
        return $validator;
    }
    
    public function validate(array $rules)
    {
        foreach ($rules as $field => $ruleSet) {
            $ruleArray = explode('|', $ruleSet);
            
            foreach ($ruleArray as $rule) {
                $this->validateRule($field, $rule);
            }
        }
    }
    
    protected function validateRule($field, $rule)
    {
        $value = $this->data[$field] ?? null;
        
        if (strpos($rule, ':') !== false) {
            list($ruleName, $parameter) = explode(':', $rule, 2);
        } else {
            $ruleName = $rule;
            $parameter = null;
        }
        
        switch ($ruleName) {
            case 'required':
                if (empty($value)) {
                    $this->errors[$field][] = "The $field field is required.";
                }
                break;
                
            case 'email':
                if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $this->errors[$field][] = "The $field must be a valid email address.";
                }
                break;
                
            case 'min':
                if (strlen($value) < $parameter) {
                    $this->errors[$field][] = "The $field must be at least $parameter characters.";
                }
                break;
                
            case 'max':
                if (strlen($value) > $parameter) {
                    $this->errors[$field][] = "The $field must not exceed $parameter characters.";
                }
                break;
                
            case 'numeric':
                if (!is_numeric($value)) {
                    $this->errors[$field][] = "The $field must be numeric.";
                }
                break;
                
            case 'integer':
                if (!filter_var($value, FILTER_VALIDATE_INT)) {
                    $this->errors[$field][] = "The $field must be an integer.";
                }
                break;
                
            case 'confirmed':
                if ($value !== ($this->data[$field . '_confirmation'] ?? null)) {
                    $this->errors[$field][] = "The $field confirmation does not match.";
                }
                break;
                
            case 'unique':
                // This would require database check - implement as needed
                break;
                
            case 'regex':
                if (!preg_match($parameter, $value)) {
                    $this->errors[$field][] = "The $field format is invalid.";
                }
                break;
        }
    }
    
    public function fails()
    {
        return !empty($this->errors);
    }
    
    public function passes()
    {
        return empty($this->errors);
    }
    
    public function errors()
    {
        return $this->errors;
    }
    
    public function firstError()
    {
        foreach ($this->errors as $fieldErrors) {
            return $fieldErrors[0];
        }
        return null;
    }
}

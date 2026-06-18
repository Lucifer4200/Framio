<?php

namespace App\Helpers;

class Database
{
    private static $connection = null;

    public static function getConnection()
    {
        if (self::$connection === null) {
            $config = require __DIR__ . '/../../config/database.php';
            $connection = $config['connections'][$config['default']];
            
            try {
                if ($connection['driver'] === 'sqlite') {
                    self::$connection = new \PDO("sqlite:" . $connection['database']);
                } else {
                    self::$connection = new \PDO(
                        "mysql:host={$connection['host']};port={$connection['port']};dbname={$connection['database']};charset={$connection['charset']}",
                        $connection['username'],
                        $connection['password']
                    );
                }
                self::$connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
                self::$connection->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
            } catch (\PDOException $e) {
                die("Database connection failed: " . $e->getMessage());
            }
        }
        
        return self::$connection;
    }

    public static function query($sql, $params = [])
    {
        $conn = self::getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public static function fetchAll($sql, $params = [])
    {
        return self::query($sql, $params)->fetchAll();
    }

    public static function fetchOne($sql, $params = [])
    {
        return self::query($sql, $params)->fetch();
    }

    public static function execute($sql, $params = [])
    {
        return self::query($sql, $params)->rowCount();
    }

    public static function lastInsertId()
    {
        return self::getConnection()->lastInsertId();
    }
}

<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateToken
{
    private const SECRET_KEY = 'framio-secret-key-2024';

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $payload = $this->verifyToken($token);

        if (!$payload) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired token'], 401);
        }

        $user = User::find($payload['user_id']);

        if (!$user || $user->status !== 'active') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        auth()->setUser($user);

        return $next($request);
    }

    private function verifyToken(string $token): ?array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $parts;

        $expected = $this->base64UrlEncode(
            hash_hmac('sha256', "{$header}.{$payload}", self::SECRET_KEY, true)
        );

        if (!hash_equals($expected, $signature)) {
            return null;
        }

        $data = json_decode($this->base64UrlDecode($payload), true);

        if (!$data || ($data['exp'] ?? 0) < time()) {
            return null;
        }

        return $data;
    }

    public static function generateToken(int $userId, string $role = 'customer'): string
    {
        $header = self::base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = self::base64UrlEncode(json_encode([
            'user_id' => $userId,
            'role' => $role,
            'iat' => time(),
            'exp' => time() + (86400 * 7),
        ]));

        $signature = self::base64UrlEncode(
            hash_hmac('sha256', "{$header}.{$payload}", self::SECRET_KEY, true)
        );

        return "{$header}.{$payload}.{$signature}";
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}

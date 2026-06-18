<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;

class WishlistController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $items = Wishlist::where('user_id', $user->id)
            ->with('product.primaryImage')
            ->latest()
            ->get();

        return response()->json(['items' => $items]);
    }

    public function add(): JsonResponse
    {
        $user = auth()->user();
        $data = request()->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $exists = Wishlist::where('user_id', $user->id)
            ->where('product_id', $data['product_id'])
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'Product already in wishlist'], 400);
        }

        Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $data['product_id'],
        ]);

        $items = Wishlist::where('user_id', $user->id)
            ->with('product.primaryImage')
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Product added to wishlist successfully',
            'items' => $items,
        ]);
    }

    public function remove(): JsonResponse
    {
        $user = auth()->user();
        $data = request()->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        Wishlist::where('user_id', $user->id)
            ->where('product_id', $data['product_id'])
            ->delete();

        $items = Wishlist::where('user_id', $user->id)
            ->with('product.primaryImage')
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Product removed from wishlist successfully',
            'items' => $items,
        ]);
    }

    public function clear(): JsonResponse
    {
        $user = auth()->user();
        Wishlist::where('user_id', $user->id)->delete();

        return response()->json(['message' => 'Wishlist cleared successfully']);
    }
}

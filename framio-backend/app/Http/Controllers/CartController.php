<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $cart->load('items.product.primaryImage');

        return response()->json([
            'cart_id' => $cart->id,
            'items' => $cart->items,
            'total' => $cart->total,
        ]);
    }

    public function add(): JsonResponse
    {
        $user = auth()->user();
        $data = request()->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($data['product_id']);

        if (!$product->isInStock() || $product->stock < $data['quantity']) {
            return response()->json([
                'error' => 'Could not add item to cart (insufficient stock or product not found)',
            ], 400);
        }

        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $existingItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $data['product_id'])
            ->first();

        if ($existingItem) {
            $newQuantity = $existingItem->quantity + $data['quantity'];

            if ($product->stock < $newQuantity) {
                return response()->json([
                    'error' => 'Insufficient stock',
                ], 400);
            }

            $existingItem->update([
                'quantity' => $newQuantity,
                'price' => $product->final_price,
            ]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $data['product_id'],
                'quantity' => $data['quantity'],
                'price' => $product->final_price,
            ]);
        }

        $cart->load('items.product.primaryImage');

        return response()->json([
            'message' => 'Item added to cart successfully',
            'cart_id' => $cart->id,
            'items' => $cart->items,
            'total' => $cart->total,
        ]);
    }

    public function update(): JsonResponse
    {
        $user = auth()->user();
        $data = request()->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:0',
        ]);

        $product = Product::findOrFail($data['product_id']);

        if (!$product->isInStock() || $product->stock < $data['quantity']) {
            return response()->json([
                'error' => 'Could not update item (insufficient stock or product not found)',
            ], 400);
        }

        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $data['product_id'])
            ->first();

        if (!$item) {
            return response()->json(['error' => 'Item not found in cart'], 404);
        }

        if ($data['quantity'] === 0) {
            $item->delete();
        } else {
            $item->update([
                'quantity' => $data['quantity'],
                'price' => $product->final_price,
            ]);
        }

        $cart->load('items.product.primaryImage');

        return response()->json([
            'message' => 'Cart updated successfully',
            'cart_id' => $cart->id,
            'items' => $cart->items,
            'total' => $cart->total,
        ]);
    }

    public function remove(): JsonResponse
    {
        $user = auth()->user();
        $data = request()->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        CartItem::where('cart_id', $cart->id)
            ->where('product_id', $data['product_id'])
            ->delete();

        $cart->load('items.product.primaryImage');

        return response()->json([
            'message' => 'Item removed from cart successfully',
            'cart_id' => $cart->id,
            'items' => $cart->items,
            'total' => $cart->total,
        ]);
    }

    public function clear(): JsonResponse
    {
        $user = auth()->user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $cart->items()->delete();

        return response()->json(['message' => 'Cart cleared successfully']);
    }
}

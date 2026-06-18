<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $query = Product::active()->with(['category:id,name', 'images', 'primaryImage']);

        if ($categoryId = request('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($search = request('search')) {
            $query->search($search);
        }

        if ($minPrice = request('min_price')) {
            $query->where('price', '>=', $minPrice);
        }

        if ($maxPrice = request('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        if ($frameType = request('frame_type')) {
            $query->where('frame_type', $frameType);
        }

        if ($size = request('size')) {
            $query->where('size', $size);
        }

        if ($color = request('color')) {
            $query->where('color', $color);
        }

        $orderBy = request('sort', 'created_at');
        $orderDir = request('order', 'DESC');
        $query->orderBy($orderBy, $orderDir);

        if ($limit = request('limit')) {
            $query->limit($limit);
        }

        $products = $query->get();

        $products->each(function ($product) {
            $product->average_rating = $product->reviews()->where('status', 'active')->avg('rating');
            $product->average_rating = $product->average_rating ? round($product->average_rating, 1) : 0;
        });

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => ['products' => $products],
        ]);
    }

    public function show($id): JsonResponse
    {
        $product = Product::with(['category:id,name', 'images', 'reviews.user:id,name'])->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $product->average_rating = $product->reviews()->where('status', 'active')->avg('rating');
        $product->average_rating = $product->average_rating ? round($product->average_rating, 1) : 0;

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => ['product' => $product],
        ]);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (empty($data['slug'])) {
            $data['slug'] = strtolower(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['name']));
        }

        $product = Product::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => ['product' => $product->fresh()],
        ], 201);
    }

    public function update($id, UpdateProductRequest $request): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $product->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => ['product' => $product->fresh()],
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }
}

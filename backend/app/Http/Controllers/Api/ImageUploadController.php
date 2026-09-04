<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageUploadController extends Controller
{
    /**
     * Liệt kê ảnh đã tải lên để dùng lại trong trình chỉnh sửa.
     */
    public function index(): JsonResponse
    {
        $extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'];
        $disk = Storage::disk('public');

        $images = collect($disk->files('uploads'))
            ->filter(fn (string $path) => in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), $extensions, true))
            ->map(fn (string $path) => [
                'path' => str_replace('\\', '/', $path),
                'url' => '/storage/'.str_replace('\\', '/', $path),
                'name' => str_replace(['-', '_'], ' ', pathinfo($path, PATHINFO_FILENAME)),
                'source' => 'uploads',
                'updatedAt' => $disk->lastModified($path),
            ])
            ->sortByDesc('updatedAt')
            ->values();

        return response()
            ->json(['images' => $images])
            ->header('Cache-Control', 'no-store, max-age=0');
    }

    /**
     * Handle incoming image upload request.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp,svg|max:10240',
        ], [
            'image.required' => 'Vui lòng chọn tệp ảnh để tải lên.',
            'image.image' => 'Tệp tải lên phải là một hình ảnh.',
            'image.mimes' => 'Định dạng ảnh được hỗ trợ: jpeg, png, jpg, gif, webp, svg.',
            'image.max' => 'Dung lượng ảnh tối đa là 10MB.',
        ]);

        if (! $request->hasFile('image') || ! $request->file('image')->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Tệp tải lên không hợp lệ hoặc bị lỗi.',
            ], 422);
        }

        $file = $request->file('image');
        $path = $file->store('uploads', 'public');

        return response()->json([
            'success' => true,
            'url' => '/storage/'.str_replace('\\', '/', $path),
            'path' => $path,
            'filename' => basename($path),
            'original_name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
        ]);
    }
}

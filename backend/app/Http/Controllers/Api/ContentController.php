<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class ContentController extends Controller
{
    private function getContentPath(): string
    {
        return storage_path('app/site-content.json');
    }

    private function getFallbackPath(): string
    {
        $frontendPublic = base_path('../frontend/public/site-content.json');
        if (File::exists($frontendPublic)) {
            return $frontendPublic;
        }

        $frontendDist = base_path('../frontend/dist/site-content.json');
        if (File::exists($frontendDist)) {
            return $frontendDist;
        }

        return '';
    }

    /**
     * Lấy dữ liệu cấu hình trang web hiện tại.
     */
    public function get(): JsonResponse
    {
        try {
            $path = $this->getContentPath();
            if (File::exists($path)) {
                $data = json_decode(File::get($path), true);
                if (!empty($data)) {
                    return response()->json($data);
                }
            }

            $fallback = $this->getFallbackPath();
            if ($fallback && File::exists($fallback)) {
                $data = json_decode(File::get($fallback), true);
                if (!empty($data)) {
                    // Tự động sao chép vào storage/app để lần sau đọc nhanh
                    $dir = dirname($path);
                    if (!File::isDirectory($dir)) {
                        @File::makeDirectory($dir, 0775, true);
                    }
                    @File::put($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
                    return response()->json($data);
                }
            }

            return response()->json(['message' => 'Chưa có cấu hình trang web.'], 404);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Lỗi đọc cấu hình: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Lưu cấu hình trang web lên máy chủ (đồng bộ cho mọi trình duyệt).
     */
    public function save(Request $request): JsonResponse
    {
        $raw = $request->getContent();
        $content = null;

        if (!empty($raw)) {
            $content = json_decode($raw, true);
        }

        if (empty($content) || !is_array($content)) {
            $content = $request->all();
        }

        if (empty($content) || !is_array($content)) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu JSON gửi lên không hợp lệ hoặc bị rỗng.',
            ], 422);
        }

        try {
            $path = $this->getContentPath();
            $dir = dirname($path);
            if (!File::isDirectory($dir)) {
                File::makeDirectory($dir, 0775, true);
            }

            $json = json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            File::put($path, $json);

            // Đồng bộ luôn vào file public/dist của frontend nếu thư mục tồn tại
            $distPath = base_path('../frontend/dist/site-content.json');
            if (File::isDirectory(dirname($distPath))) {
                @File::put($distPath, $json);
            }
            $publicPath = base_path('../frontend/public/site-content.json');
            if (File::isDirectory(dirname($publicPath))) {
                @File::put($publicPath, $json);
            }

            return response()->json([
                'success' => true,
                'message' => 'Đã lưu cấu hình lên máy chủ thành công.',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi ghi cấu hình máy chủ: ' . $e->getMessage() . '. Hãy kiểm tra quyền ghi thư mục storage.',
            ], 500);
        }
    }
}

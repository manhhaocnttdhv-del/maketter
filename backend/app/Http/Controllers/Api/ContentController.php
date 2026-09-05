<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JsonException;

class ContentController extends Controller
{
    /**
     * Lấy dữ liệu cấu hình trang web hiện tại.
     */
    public function get(): JsonResponse
    {
        try {
            $record = SiteContent::query()
                ->where('key', SiteContent::ACTIVE_KEY)
                ->first();

            if (! $record) {
                return response()->json(['message' => 'Chưa có cấu hình trang web trong cơ sở dữ liệu.'], 404);
            }

            return response()
                ->json($record->content)
                ->header('Cache-Control', 'no-store, max-age=0');
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['message' => 'Không thể đọc cấu hình từ cơ sở dữ liệu.'], 500);
        }
    }

    /**
     * Lưu cấu hình trang web lên máy chủ (đồng bộ cho mọi trình duyệt).
     */
    public function save(Request $request): JsonResponse
    {
        try {
            $content = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu gửi lên không phải JSON hợp lệ.',
            ], 422);
        }

        if (! is_array($content)) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu JSON phải là một object.',
            ], 422);
        }

        $validator = Validator::make($content, [
            'meta' => ['required', 'array'],
            'meta.title' => ['required', 'string', 'max:255'],
            'settings' => ['required', 'array'],
            'assets' => ['required', 'array'],
            'navigation' => ['required', 'array'],
            'hero' => ['required', 'array'],
            'timeline.rounds' => ['sometimes', 'array'],
            'timeline.rounds.*.title' => ['present', 'string'],
            'timeline.rounds.*.date' => ['present', 'string'],
            'timeline.rounds.*.description' => ['present', 'string'],
            'faq' => ['sometimes', 'array'],
            'faq.*.question' => ['present', 'string'],
            'faq.*.answer' => ['present', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'JSON thiếu cấu trúc bắt buộc của website.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $record = SiteContent::query()->updateOrCreate(
                ['key' => SiteContent::ACTIVE_KEY],
                ['content' => $content],
            );

            return response()->json([
                'success' => true,
                'message' => 'Đã lưu cấu hình vào cơ sở dữ liệu.',
                'updatedAt' => $record->updated_at?->toIso8601String(),
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Không thể lưu cấu hình vào cơ sở dữ liệu.',
            ], 500);
        }
    }
}

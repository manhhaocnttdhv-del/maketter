<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;
use JsonException;
use PDO;
use RuntimeException;

class SiteContentSeeder extends Seeder
{
    /**
     * Copy the active website configuration from the legacy SQLite database
     * into the database configured for the current environment (for example MySQL).
     */
    public function run(): void
    {
        $sqlitePath = database_path('database.sqlite');

        if (! is_file($sqlitePath)) {
            throw new RuntimeException("Không tìm thấy SQLite nguồn tại: {$sqlitePath}");
        }

        $sqlite = new PDO('sqlite:'.$sqlitePath, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ]);
        $statement = $sqlite->prepare('SELECT content FROM site_contents WHERE "key" = :key LIMIT 1');
        $statement->execute(['key' => SiteContent::ACTIVE_KEY]);
        $contentJson = $statement->fetchColumn();

        if (! is_string($contentJson) || $contentJson === '') {
            throw new RuntimeException('SQLite nguồn chưa có cấu hình website để chuyển sang database mới.');
        }

        try {
            $content = json_decode($contentJson, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            throw new RuntimeException('Cấu hình trong SQLite không phải JSON hợp lệ.', 0, $exception);
        }

        SiteContent::query()->updateOrCreate(
            ['key' => SiteContent::ACTIVE_KEY],
            ['content' => $content],
        );

        $this->command?->info('Đã chuyển cấu hình website từ SQLite sang database hiện tại.');
    }
}

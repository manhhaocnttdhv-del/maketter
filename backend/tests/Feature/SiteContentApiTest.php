<?php

namespace Tests\Feature;

use App\Models\SiteContent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiteContentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_returns_the_active_content_from_sqlite(): void
    {
        SiteContent::query()->create([
            'key' => SiteContent::ACTIVE_KEY,
            'content' => $this->validContent(),
        ]);

        $response = $this->getJson('/api/site-content');

        $response
            ->assertOk()
            ->assertJsonPath('meta.title', 'Trang kiểm thử');

        $this->assertStringContainsString('no-store', (string) $response->headers->get('Cache-Control'));

        $this->assertDatabaseHas('site_contents', ['key' => SiteContent::ACTIVE_KEY]);
    }

    public function test_post_updates_the_active_content_in_sqlite(): void
    {
        $content = $this->validContent();
        $content['meta']['title'] = 'Trang mới';

        $this->postJson('/api/site-content', $content)
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertSame(
            'Trang mới',
            SiteContent::query()->where('key', SiteContent::ACTIVE_KEY)->firstOrFail()->content['meta']['title'],
        );
    }

    public function test_post_rejects_json_without_the_required_site_structure(): void
    {
        $this->postJson('/api/site-content', ['meta' => ['title' => 'Thiếu dữ liệu']])
            ->assertUnprocessable()
            ->assertJsonPath('success', false);

        $this->assertDatabaseCount('site_contents', 0);
    }

    public function test_get_does_not_fallback_to_a_json_file_when_sqlite_is_empty(): void
    {
        $this->getJson('/api/site-content')
            ->assertNotFound()
            ->assertJsonPath('message', 'Chưa có cấu hình trang web trong cơ sở dữ liệu.');
    }

    public function test_post_rejects_null_timeline_text_that_would_break_the_frontend(): void
    {
        $content = $this->validContent();
        $content['timeline']['rounds'][] = [
            'title' => 'Viral clip',
            'date' => null,
            'description' => null,
        ];

        $this->postJson('/api/site-content', $content)
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'timeline.rounds.0.date',
                'timeline.rounds.0.description',
            ]);
    }

    private function validContent(): array
    {
        return [
            'meta' => ['title' => 'Trang kiểm thử'],
            'settings' => ['global' => ['containerWidth' => 1280]],
            'assets' => ['headerLogo' => '/logo.png'],
            'navigation' => [['label' => 'Trang chủ', 'target' => '#home']],
            'hero' => ['titleLineOne' => 'Nội dung'],
        ];
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ImageLibraryApiTest extends TestCase
{
    public function test_it_lists_uploaded_images_and_ignores_other_files(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('uploads/logo.png', 'image-content');
        Storage::disk('public')->put('uploads/readme.txt', 'not-an-image');

        $this->getJson('/api/images')
            ->assertOk()
            ->assertJsonCount(1, 'images')
            ->assertJsonPath('images.0.path', 'uploads/logo.png')
            ->assertJsonPath('images.0.url', '/storage/uploads/logo.png')
            ->assertJsonPath('images.0.source', 'uploads');
    }
}

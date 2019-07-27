<?php

Auth::routes();

Route::middleware('auth')->group(function () {
    Route::resource('gallery', 'GalleryController');
    Route::get('/{any}', 'SpaController@index')->where('any', '.*');
});


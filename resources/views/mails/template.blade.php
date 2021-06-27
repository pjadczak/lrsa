@extends('templates.mail')

@if ($photo!='')

@section('image')

<div class="imageTop">
    <img src="{{ env('APP_URL') }}/uploads/photos/{{ $photo }}" />
</div>

@endsection

@endif


@section('content')

{!! $template !!}

@endsection
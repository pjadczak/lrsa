<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel-React Startup Application</title>
    <!-- Styles -->
    <link href="{{ asset('css/fonts/roboto.css') }}" rel="stylesheet">
    <link href="{{ asset('css/fonts/nunito.css') }}" rel="stylesheet">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
</head>

<body>

    <!-- React root DOM -->
    <div id="root">
    </div>

    <!-- React JS -->
    <script src="{{ asset('js/index.js') }}" defer></script>

</body>
</html>
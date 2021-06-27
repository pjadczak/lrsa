@extends('templates.mail')

@section('content')
Witaj systemie zmiany hasła w serwisie <strong>VIKS</strong><br /><br />

Aby ustawić nowe hasło do swojego konta kliknij na poniższy link, zostaniesz przeniesiony na stronę gdzie będziesz mogł ustawić nowe hasło.<br /><br />
Twój link to: <a href="{{ $link }}">{{ $link }}</a><br /><br />

Jeśli ktoś wykorzystał Twój adres e-mail zignoruj tą wiadomość.
@endsection
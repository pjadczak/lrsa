<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body>

    <div class="mainBlock">
        @yield('image')
        <div class="content">
            @yield('content')
        </div>

        <footer bgcolor="#505050">
            <a href="{{ url("/") }}"><img src="{{ url("/") }}/images/logo.png" /></a>
            <div class="text">
                Message sent automatically, please do not reply to it.<br />
                If you have a question about the message you received, please contact the site organizer.
            </div>
        </footer>
    </div>

</body>
</html>
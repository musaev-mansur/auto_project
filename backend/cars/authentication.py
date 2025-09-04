from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """Session authentication class that does not enforce CSRF checks."""

    def enforce_csrf(self, request):
        return
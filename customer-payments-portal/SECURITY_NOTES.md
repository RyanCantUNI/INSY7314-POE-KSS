# Security Notes & Deployment Guidance

1. **SSL/TLS termination**: For production, terminate TLS at a reverse proxy (Nginx, AWS ALB, Google Cloud Load Balancer) or let your PaaS handle certificates (Netlify, Vercel, Heroku). The Express `forceHttps` middleware expects `x-forwarded-proto` header from proxy.

2. **Strong secrets**: Use a long random `JWT_SECRET` and keep `.env` out of source control. Rotate secrets periodically.

3. **Password policy**: Enforce and document password policy. Consider adding multi-factor authentication for higher security.

4. **Database safety**: All DB queries use parameterized queries to avoid SQL injection. If you switch to an ORM, keep using parameterized binding.

5. **CSP & XSS**: Helmet sets a base CSP. Tighten script/style sources for your real CDN. Use DOMPurify when rendering any HTML from user input.

6. **CSRF**: CSRF protection uses double-submit cookie and server validation. For extra protection, set CSRF token in a separate API response header and validate it.

7. **Rate limiting**: Rate limits prevent brute-force attacks. Consider separate stricter limits on auth endpoints.

8. **Audit & logging**: Log auth events and monitor for suspicious behavior. Don't log passwords or sensitive tokens.

9. **Automated scanning**: Run dependency vulnerability scans, SCA, and penetration testing before production.

10. **Content Security Policy and cookie flags**: Use `httpOnly`, `Secure`, `SameSite=strict` and HSTS.
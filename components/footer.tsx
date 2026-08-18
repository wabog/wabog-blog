/* eslint-disable @next/next/no-img-element */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img
            className="brand-logo-light"
            src="/wabog_name_logo_light.webp"
            alt="WABOG"
          />
          <img
            className="brand-logo-dark"
            src="/wabog_name_logo.webp"
            alt="WABOG"
          />
        </div>

        <div className="footer-col">
          <h4>Redes sociales</h4>
          <div className="footer-links">
            <a href="https://www.linkedin.com/company/wabog" target="_blank" rel="noopener noreferrer" data-analytics="footer_linkedin" data-analytics-location="footer">Linkedin</a>
            <a href="https://www.instagram.com/wabog.ia/" target="_blank" rel="noopener noreferrer" data-analytics="footer_instagram" data-analytics-location="footer">Instagram</a>
            <a href="https://www.tiktok.com/@wabog" target="_blank" rel="noopener noreferrer" data-analytics="footer_tiktok" data-analytics-location="footer">Tiktok</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Producto</h4>
          <div className="footer-links">
            <a href="https://wabog.com/mcp/" data-analytics="footer_mcp" data-analytics-location="footer">Wabog MCP</a>
            <a href="https://wabog.com/#pricing" data-analytics="footer_precios" data-analytics-location="footer">Precios</a>
            <a href="https://app.wabog.com" data-analytics="footer_login" data-analytics-location="footer">Inicia sesión</a>
            <a href="/" data-analytics="footer_blog" data-analytics-location="footer">Blog</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <div className="footer-links">
            <a href="https://wabog.com/legal.html" data-analytics="footer_terminos" data-analytics-location="footer">Términos y condiciones</a>
            <a href="https://wabog.com/privacy.html" data-analytics="footer_privacidad" data-analytics-location="footer">Politica de privacidad</a>
            <a href="https://wabog.com/support/" data-analytics="footer_soporte" data-analytics-location="footer" rel="noopener noreferrer">Soporte</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

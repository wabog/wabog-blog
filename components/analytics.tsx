import Script from "next/script";

const GA_ID = "G-3MJTDC5BSK";

export function Analytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');

          document.addEventListener('click', function (e) {
            var el = e.target && e.target.closest ? e.target.closest('[data-analytics]') : null;
            if (!el) return;
            gtag('event', el.getAttribute('data-analytics'), {
              location: el.getAttribute('data-analytics-location') || null
            });
          });
        `}
      </Script>
    </>
  );
}
const adsenseClient =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-2117459249791132";

export default function Head() {
  return (
    <>
      <meta content={adsenseClient} name="google-adsense-account" />
      <script
        async
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
      />
    </>
  );
}

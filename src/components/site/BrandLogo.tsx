import logo from &quot;@/assets/wing-fires-logo.jpg.asset.json&quot;;

export function BrandLogo({
  size = 40,
  showText = true,
  subtitle = &quot;Aircraft Parts Supplier&quot;,
}: {
  size?: number;
  showText?: boolean;
  subtitle?: string | null;
}) {
  return (
    &lt;span className=&quot;flex items-center gap-2.5 shrink-0&quot;&gt;
      &lt;span
        className=&quot;relative grid place-items-center rounded-xl bg-white shadow-[0_6px_24px_-8px_rgba(96,165,250,0.5)] ring-1 ring-white/20 overflow-hidden&quot;
        style={{ height: size, width: size }}
      &gt;
        &lt;img
          src={logo.url}
          alt=&quot;Wing Fires logo&quot;
          className=&quot;h-full w-full object-contain p-0.5&quot;
          loading=&quot;eager&quot;
          decoding=&quot;async&quot;
        /&gt;
      &lt;/span&gt;
      {showText &amp;&amp; (
        &lt;span className=&quot;leading-tight&quot;&gt;
          &lt;span className=&quot;block font-display text-base font-bold tracking-tight&quot;&gt;
            Wing &lt;span className=&quot;text-gradient-electric&quot;&gt;Fires&lt;/span&gt;
          &lt;/span&gt;
          {subtitle &amp;&amp; (

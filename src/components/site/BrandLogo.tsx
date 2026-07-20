import logo from "@/src/assets/wing-fires-logo.jpg.asset.json";

export function BrandLogo({
  size = 40,
  showText = true,
  subtitle = "Aircraft Parts Supplier",
}: {
  size?: number;
  showText?: boolean;
  subtitle?: string | null;
}) {
  return (
    <span className="flex items-center gap-2.5 shrink-0">
      <span
        className="relative grid place-items-center rounded-xl bg-white shadow-[0_6px_24px_-8px_rgba(96,165,250,0.5)] ring-1 ring-white/20 overflow-hidden"
        style={{ height: size, width: size }}
      >
        <img
          src={logo.url}
          alt="Wing Fires logo"
          className="h-full w-full object-contain p-0.5"
          loading="eager"
          decoding="async"
        />
      </span>

      {showText && (
        <span className="leading-tight">
          <span className="block font-display text-base font-bold tracking-tight">
            Wing <span className="text-gradient-electric">Fires</span>
          </span>

          {subtitle && (
            <span className="block text-xs text-muted-foreground">
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

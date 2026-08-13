import Image from "next/image";

export function Cover({
  src,
  title,
  className = "",
}: { src?: string; title: string; className?: string }) {
  return (
    <div className={`cover ${className}`}>
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      ) : (
        <div className="cover-gradient">
          <span>{title}</span>
        </div>
      )}
    </div>
  );
}
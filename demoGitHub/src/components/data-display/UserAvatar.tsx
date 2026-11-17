type AvatarProps = {
  name?: string | null;
  size?: number;
  src?: string | null;
};

export function Avatar({
  name,
  size = 40,
  src,
}: AvatarProps) {
  const initial = (name?.trim().charAt(0) || "?").toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name ? `Avatar de ${name}` : "Avatar"}
        width={size}
        height={size}
        className="wayco-avatar object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="wayco-avatar"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.42),
      }}
      aria-label={name ? `Avatar de ${name}` : "Avatar"}
    >
      {initial}
    </span>
  );
}

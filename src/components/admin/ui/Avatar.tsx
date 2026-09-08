import { initials, classNames } from "@/lib/admin/utils";

interface AvatarProps {
  name?: string;
  color?: string;
  size?: number;
  className?: string;
}

export default function Avatar({ name = "", color = "#ff7a1a", size = 36, className }: AvatarProps) {
  return (
    <div
      className={classNames("flex items-center justify-center rounded-full font-semibold shrink-0", className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `${color}22`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      {initials(name) || "?"}
    </div>
  );
}

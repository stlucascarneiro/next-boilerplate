import { cva, VariantProps } from "cva";
import Image from "next/image";

const cvaAvatar = cva("rounded-full border font-medium", {
  defaultVariants: {
    color: "sky",
    size: "md",
    type: "initials",
  },
  variants: {
    color: {
      amber: "text-amber-700 border-amber-700 bg-amber-200",
      blue: "text-blue-700 border-blue-700 bg-blue-200",
      cyan: "text-cyan-700 border-cyan-700 bg-cyan-200",
      emerald: "text-emerald-700 border-emerald-700 bg-emerald-200",
      fuchsia: "text-fuchsia-700 border-fuchsia-700 bg-fuchsia-200",
      gray: "text-gray-700 border-gray-700 bg-gray-200",
      green: "text-green-700 border-green-700 bg-green-200",
      indigo: "text-indigo-700 border-indigo-700 bg-indigo-200",
      lime: "text-lime-700 border-lime-700 bg-lime-200",
      neutral: "text-neutral-700 border-neutral-700 bg-neutral-200",
      orange: "text-orange-700 border-orange-700 bg-orange-200",
      pink: "text-pink-700 border-pink-700 bg-pink-200",
      purple: "text-purple-700 border-purple-700 bg-purple-200",
      red: "text-red-700 border-red-700 bg-red-200",
      rose: "text-rose-700 border-rose-700 bg-rose-200",
      sky: "text-sky-700 border-sky-700 bg-sky-200",
      slate: "text-slate-700 border-slate-700 bg-slate-400",
      stone: "text-stone-700 border-stone-700 bg-stone-200",
      teal: "text-teal-700 border-teal-700 bg-teal-200",
      violet: "text-violet-700 border-violet-700 bg-violet-200",
      yellow: "text-yellow-700 border-yellow-700 bg-yellow-200",
      zinc: "text-zinc-700 border-zinc-700 bg-zinc-200",
    },
    size: {
      lg: "h-10 w-10 text-sm",
      md: "h-8 w-8 text-xs",
      sm: "h-6 w-6 text-[10px]",
    },
    type: {
      image: "border-subtle dark:border-dark-subtle",
      initials: "flex items-center justify-center",
    },
  },
});

const cvaAvatarSpacing = cva("", {
  defaultVariants: {
    spacing: "md",
  },
  variants: {
    spacing: {
      lg: "-ml-3",
      md: "-ml-2",
      sm: "-ml-1",
    },
  },
});

type TAvatarCVA = VariantProps<typeof cvaAvatar>;
type TAvatarSpacingCVA = VariantProps<typeof cvaAvatarSpacing>;
type TAvatarColor = TAvatarCVA["color"];
type TAvatarSize = TAvatarCVA["size"];
type TAvatarSpacing = TAvatarSpacingCVA["spacing"];

interface IAvatarItem {
  color?: TAvatarColor;
  image?: string;
  name: string;
}

interface IAvatar {
  className?: string;
  items: IAvatarItem[];
  size?: TAvatarSize;
  spacing?: TAvatarSpacing;
}

const MAX_VISIBLE_AVATARS = 3;
const imageSizeByVariant: Record<NonNullable<TAvatarSize>, number> = {
  lg: 40,
  md: 32,
  sm: 24,
};

function getInitials(name: string) {
  const nameArr = name.split(" ");
  const firstName = nameArr[0] ?? "";
  const lastName = nameArr.length > 1 ? nameArr[nameArr.length - 1] : "";
  return `${firstName[0] ?? ""}${lastName?.[0] ?? ""}`;
}

function AvatarItem({
  color,
  image,
  name,
  size,
}: IAvatarItem & { size?: TAvatarSize }) {
  const initials = getInitials(name);
  const imageSize = imageSizeByVariant[size ?? "md"];

  if (image)
    return (
      <Image
        alt={name}
        className={cvaAvatar({ size, type: "image" })}
        height={imageSize}
        src={image}
        width={imageSize}
      />
    );

  return (
    <div className={cvaAvatar({ color, size, type: "initials" })}>
      {initials}
    </div>
  );
}

export const Avatar = ({ className, items, size, spacing }: IAvatar) => {
  const visibleItems = items.slice(0, MAX_VISIBLE_AVATARS);
  const remainingItems = items.length - MAX_VISIBLE_AVATARS;

  return (
    <div className={["flex items-center", className].filter(Boolean).join(" ")}>
      {visibleItems.map((item, index) => (
        <div
          className={index === 0 ? "" : cvaAvatarSpacing({ spacing })}
          key={`${item.name}-${index}`}
          style={{ zIndex: visibleItems.length - index + 1 }}
        >
          <AvatarItem
            color={item.color}
            image={item.image}
            name={item.name}
            size={size}
          />
        </div>
      ))}

      {remainingItems > 0 && (
        <div className={cvaAvatarSpacing({ spacing })} style={{ zIndex: 0 }}>
          <div
            className={cvaAvatar({ size, type: "initials" })}
          >{`+${remainingItems}`}</div>
        </div>
      )}
    </div>
  );
};

interface IProps {
  complementary?: string;
  icon?: React.ReactNode;
  label?: string;
  value: string;
}

export default function DetailRow({
  complementary,
  icon,
  label,
  value,
}: IProps) {
  return (
    <div className="flex items-center gap-4 rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/5">
      <div
        className={`text-subtle flex items-center gap-2 ${!!label ? "min-w-40" : "text-xl"}`}
      >
        {!!icon && icon}
        {!!label && <span className="font-medium">{label}</span>}
      </div>
      <div className="flex flex-col">
        <span className="text-strong">{value}</span>
        {complementary && (
          <span className="text-subtle text-sm">{complementary}</span>
        )}
      </div>
    </div>
  );
}

interface IContainer {
  children: React.ReactNode;
}

export default function MainContainer({ children }: IContainer) {
  return (
    <main className={"flex w-full justify-center overflow-y-auto"}>
      <div className="flex h-fit w-full max-w-184 flex-col gap-2 px-2 py-4">
        {children}
      </div>
    </main>
  );
}

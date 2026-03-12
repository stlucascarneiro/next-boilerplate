"use client";

import {
  type ButtonHTMLAttributes,
  createContext,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";

type TabsValue = string;

interface TabsBaseProps {
  children: ReactNode;
  className?: string;
  defaultValue?: TabsValue;
  onValueChange?: (value: TabsValue) => void;
  value?: TabsValue;
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> {
  children: ReactNode;
  className?: string;
  value: TabsValue;
}

interface TabsContentProps {
  children: ReactNode;
  className?: string;
  forceMount?: boolean;
  value: TabsValue;
}

type TabsContextType = {
  activeValue: null | TabsValue;
  baseId: string;
  setValue: (value: TabsValue) => void;
};

const TabsContext = createContext<null | TabsContextType>(null);

function useTabs() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs components must be used within Tabs");
  }

  return context;
}

function toStableId(value: TabsValue) {
  return value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
}

type TabsCompoundComponent = ((props: TabsBaseProps) => ReactNode) & {
  Content: (props: TabsContentProps) => ReactNode;
  List: (props: TabsListProps) => ReactNode;
  Trigger: (props: TabsTriggerProps) => ReactNode;
};

function TabsBase({
  children,
  className,
  defaultValue,
  onValueChange,
  value,
}: TabsBaseProps) {
  const generatedId = useId();
  const baseId = generatedId.replace(/:/g, "");
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<null | TabsValue>(
    defaultValue ?? null,
  );

  const activeValue = isControlled ? (value ?? null) : internalValue;

  const setValue = useCallback(
    (nextValue: TabsValue) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  const contextValue = useMemo(
    () => ({ activeValue, baseId, setValue }),
    [activeValue, baseId, setValue],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className} data-slot="tabs-root">
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className }: TabsListProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const keys = ["ArrowLeft", "ArrowRight", "End", "Home"];

      if (!keys.includes(event.key)) {
        return;
      }

      const tabs = Array.from(
        event.currentTarget.querySelectorAll<HTMLButtonElement>(
          '[role="tab"]:not([disabled])',
        ),
      );

      if (!tabs.length) {
        return;
      }

      const currentIndex = tabs.findIndex(
        (tab) => tab === document.activeElement,
      );
      const safeCurrentIndex = currentIndex < 0 ? 0 : currentIndex;

      let nextIndex = safeCurrentIndex;

      if (event.key === "ArrowRight") {
        nextIndex = (safeCurrentIndex + 1) % tabs.length;
      }

      if (event.key === "ArrowLeft") {
        nextIndex = (safeCurrentIndex - 1 + tabs.length) % tabs.length;
      }

      if (event.key === "Home") {
        nextIndex = 0;
      }

      if (event.key === "End") {
        nextIndex = tabs.length - 1;
      }

      event.preventDefault();
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    },
    [],
  );

  return (
    <div
      aria-orientation="horizontal"
      className={[
        "border-border-surface inline-flex w-fit items-center gap-1 border-b",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-slot="tabs-list"
      onKeyDown={handleKeyDown}
      role="tablist"
    >
      {children}
    </div>
  );
}

function TabsTrigger({
  children,
  className,
  onClick,
  value,
  ...props
}: TabsTriggerProps) {
  const { activeValue, baseId, setValue } = useTabs();

  const valueId = toStableId(value);
  const tabId = `${baseId}-tab-${valueId}`;
  const panelId = `${baseId}-panel-${valueId}`;
  const isActive = activeValue === value;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (event.defaultPrevented) {
        return;
      }

      setValue(value);
    },
    [onClick, setValue, value],
  );

  return (
    <button
      {...props}
      aria-controls={panelId}
      aria-selected={isActive}
      className={[
        "rounded-t-md px-4 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-dashed",
        isActive
          ? "text-primary border-primary border-b-2"
          : "text-subtle hover:text-strong border-b-2 border-transparent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-slot="tabs-trigger"
      id={tabId}
      onClick={handleClick}
      role="tab"
      tabIndex={isActive ? 0 : -1}
      type="button"
    >
      {children}
    </button>
  );
}

function TabsContent({
  children,
  className,
  forceMount = false,
  value,
}: TabsContentProps) {
  const { activeValue, baseId } = useTabs();

  const valueId = toStableId(value);
  const tabId = `${baseId}-tab-${valueId}`;
  const panelId = `${baseId}-panel-${valueId}`;
  const isActive = activeValue === value;

  if (!isActive && !forceMount) {
    return null;
  }

  return (
    <div
      aria-labelledby={tabId}
      className={[
        "text-strong mt-3 outline-none",
        !isActive ? "hidden" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-slot="tabs-content"
      id={panelId}
      role="tabpanel"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

const Tabs = TabsBase as TabsCompoundComponent;

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export default Tabs;

import * as RadixTooltip from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

export const TooltipProvider = RadixTooltip.Provider

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <RadixTooltip.Root delayDuration={300}>{children}</RadixTooltip.Root>
}

export const TooltipTrigger = RadixTooltip.Trigger

export function TooltipContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        sideOffset={5}
        className={cn(
          'z-50 rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-md',
          'animate-in fade-in-0 zoom-in-95',
          className
        )}
      >
        {children}
        <RadixTooltip.Arrow className="fill-slate-900" />
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  )
}

/** Convenience wrapper: <Tip label="hint">…trigger…</Tip> */
export function Tip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children as React.ReactElement}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

import { type JSX, type ReactNode } from 'react'

interface ConditionalWrapperProps {
    condition: boolean;
    wrapper: (children: ReactNode) => JSX.Element;
    children: ReactNode
}

const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps) => {
    return condition ? wrapper(children) : children;
}

export default ConditionalWrapper
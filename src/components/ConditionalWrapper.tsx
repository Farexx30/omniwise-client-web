import React, { type JSX, type ReactNode } from 'react'

interface ConditionalWrapperProps {
    condition: boolean;
    wrapper: (children: React.ReactNode) => JSX.Element;
    children: ReactNode
}

const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps) => {
    return condition ? wrapper(children) : children;
}

export default ConditionalWrapper
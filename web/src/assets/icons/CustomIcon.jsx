import React from "react";

export const CustomIcon = ({ size = 16, width, height, ...props }) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 16 16"
        width={size || width}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M7.25 3.5C6.00736 3.5 5 4.50736 5 5.75V9.75C5 10.9926 6.00736 12 7.25 12H11V10H8V7H14V15H7.25C4.3505 15 2 12.6495 2 9.75V5.75C2 2.8505 4.35051 0.5 7.25 0.5H8.75C11.3949 0.5 13.5829 2.45578 13.9468 5H10.872C10.5631 4.12611 9.72966 3.5 8.75 3.5H7.25Z"
            fill="currentColor"
        />
    </svg>
);
